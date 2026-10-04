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

        const paceLabel =
            ratePerDay >= 3
                ? 'High-velocity execution'
                : ratePerDay >= 1
                ? 'Consistent daily rhythm'
                : totalCompleted > 0
                ? 'Building momentum'
                : 'Ready for first check-in';

        return {
            windowDays: currentWindowDays,
            totalCompleted,
            ratePerDay,
            formattedRate,
            paceLabel,
        };
    }, [normalizedCategories, currentWindowDays]);

    // 8. Radar Chart Data
    const radarData = useMemo(() => {
        return normalizedCategories.slice(0, 6).map((cat) => {
            const strengthPercent =
                cat.itemCount > 0 ? Math.round((cat.completedCount / cat.itemCount) * 100) : 0;
            return {
                category: cat.name.split(' ')[0],
                fullName: cat.name,
                focusVolume: cat.itemCount,
                completionStrength: strengthPercent,
                key: cat.key,
                isSelected: selectedCategoryKey === cat.key,
            };
        });
    }, [normalizedCategories, selectedCategoryKey]);

    // 9. Bar Chart Data
    const barData = useMemo(() => {
        return normalizedCategories.map((cat) => {
            const completed = cat.completedCount;
            const pending = Math.max(0, cat.itemCount - cat.completedCount);
            const total = cat.itemCount;
            const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const pendingPct = total > 0 ? 100 - completedPct : 0;

            return {
                name: cat.name.split(' ')[0],
                fullName: cat.name,
                key: cat.key,
                completed,
                pending,
                total,
                completedPct,
                pendingPct,
                color: cat.color,
                isSelected: selectedCategoryKey === cat.key,
            };
        });
    }, [normalizedCategories, selectedCategoryKey]);

    // 10. Cadence Trend Data
    const cadenceTrend = useMemo(() => {
        if (currentWindowDays <= 14) {
            return dynamicActivities.slice(-currentWindowDays).map((d) => ({
                label: d.displayDate.split(',')[0],
                actions: d.totalActions,
                challengeLogs: d.challengeActions,
            }));
        }

        const weeksMap: Record<number, { label: string; actions: number; challengeLogs: number }> = {};
        const totalActs = dynamicActivities.length;
        const actsToGroup = dynamicActivities.slice(Math.max(0, totalActs - currentWindowDays));

        actsToGroup.forEach((d, idx) => {
            const weekIdx = Math.floor(idx / 7) + 1;
            if (!weeksMap[weekIdx]) {
                weeksMap[weekIdx] = {
                    label: `Wk ${weekIdx}`,
                    actions: 0,
                    challengeLogs: 0,
                };
            }
            weeksMap[weekIdx].actions += d.totalActions;
            weeksMap[weekIdx].challengeLogs += d.challengeActions;
        });

        return Object.values(weeksMap);
    }, [dynamicActivities, currentWindowDays]);

    return {
        normalizedCategories,
        activeCategory,
        currentWindowDays,
        dynamicActivities,
        highestEfficiency,
        highestVolume,
        velocityStats,
        radarData,
        barData,
        cadenceTrend,
    };
}
