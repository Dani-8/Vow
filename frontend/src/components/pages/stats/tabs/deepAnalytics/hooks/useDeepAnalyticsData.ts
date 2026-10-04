import { useMemo } from 'react';
import {
    CategoryBreakdownItem,
    DayActivity,
    generateCategoryActivityHeatmap,
} from '../../../statsHelpers';
import { Task, Challenge } from '../../../../../../types';
import { AnalyticsFilterState } from '../components/AnalyticsControlBar';
import { filterActivities } from '../utils/filterHelpers';

const HARMONIOUS_COLORS = [
    '#549acb', // Brand Blue
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
];

interface UseDeepAnalyticsDataParams {
    categories: CategoryBreakdownItem[];
    heatmapActivities: DayActivity[];
    tasks: Task[];
    challenges: Challenge[];
    filters: AnalyticsFilterState;
    selectedCategoryKey: string | null;
}

export function useDeepAnalyticsData({
    categories,
    heatmapActivities,
    tasks,
    challenges,
    filters,
    selectedCategoryKey,
}: UseDeepAnalyticsDataParams) {
    // 1. Normalize category colors
    const normalizedCategories = useMemo(() => {
        return categories.map((cat, idx) => ({
            ...cat,
            color: HARMONIOUS_COLORS[idx % HARMONIOUS_COLORS.length],
        }));
    }, [categories]);

    // 2. Currently filtered category
    const activeCategory = useMemo(() => {
        if (!selectedCategoryKey) return null;
        return normalizedCategories.find((c) => c.key === selectedCategoryKey) || null;
    }, [selectedCategoryKey, normalizedCategories]);

    // 3. Category filtered base heatmap
    const categoryFilteredHeatmap = useMemo(() => {
        if (!activeCategory) return heatmapActivities;
        return generateCategoryActivityHeatmap(tasks, challenges, activeCategory.name, 52);
    }, [activeCategory, tasks, challenges, heatmapActivities]);

    // 4. Apply Global Filters (Time horizon, Day of week, Execution Type)
    const dynamicActivities = useMemo(() => {
        return filterActivities(categoryFilteredHeatmap, filters);
    }, [categoryFilteredHeatmap, filters]);

    // 5. Determine window days based on filters.timeRange
    const currentWindowDays = useMemo(() => {
        if (filters.timeRange === '7d') return 7;
        if (filters.timeRange === '14d') return 14;
        if (filters.timeRange === '30d') return 30;
        if (filters.timeRange === '90d') return 90;
        if (filters.timeRange === 'custom' && filters.customStartDate && filters.customEndDate) {
            const start = new Date(filters.customStartDate).getTime();
            const end = new Date(filters.customEndDate).getTime();
            const diff = Math.round(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
            return Math.max(7, Math.min(diff, 90));
        }
        return 30;
    }, [filters]);

    // 6. Efficiency calculations
    const sortedByEfficiency = useMemo(() => {
        return [...normalizedCategories].sort((a, b) => {
            const effA = a.itemCount > 0 ? a.completedCount / a.itemCount : 0;
            const effB = b.itemCount > 0 ? b.completedCount / b.itemCount : 0;
            return effB - effA;
        });
    }, [normalizedCategories]);

    const highestEfficiency = sortedByEfficiency[0];
    const highestVolume = useMemo(() => {
        return [...normalizedCategories].sort((a, b) => b.itemCount - a.itemCount)[0];
    }, [normalizedCategories]);

    // 7. Execution velocity calculation
    const velocityStats = useMemo(() => {
        const totalCompleted = normalizedCategories.reduce((sum, c) => sum + c.completedCount, 0);
        const ratePerDay = currentWindowDays > 0 ? totalCompleted / currentWindowDays : 0;
        const formattedRate = ratePerDay >= 10 ? ratePerDay.toFixed(0) : ratePerDay.toFixed(1);

