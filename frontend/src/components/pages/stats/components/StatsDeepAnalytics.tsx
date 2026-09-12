import React, { useState, useMemo } from 'react';
import {
    CategoryBreakdownItem,
    DayActivity,
    EcosystemOverview,
    generateCategoryActivityHeatmap,
} from '../statsHelpers';
import { Task, Challenge } from '../../../../types';
import { TaskMap } from '../../task-map/types';
import { StatsMomentumEngine } from './StatsMomentumEngine';
import {
    StatsControlBar,
    AnalyticsFilterState,
} from './StatsControlBar';
import { filterActivities } from './filterHelpers';
import {
    TrendingUp,
    Compass,
    PieChart as PieIcon,
    BarChart3,
    Activity,
    Flame,
    ShieldCheck,
    X,
    Filter,
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area,
} from 'recharts';

interface StatsDeepAnalyticsProps {
    categories: CategoryBreakdownItem[];
    heatmapActivities: DayActivity[];
    overview: EcosystemOverview;
    tasks?: Task[];
    challenges?: Challenge[];
    taskMaps?: TaskMap[];
}

// Cohesive palette matching CreateChallengeModal and brand blue (#549acb)
const HARMONIOUS_COLORS = [
    '#549acb', // Brand Blue
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
];

export const StatsDeepAnalytics: React.FC<StatsDeepAnalyticsProps> = ({
    categories,
    heatmapActivities,
    overview,
    tasks = [],
    challenges = [],
}) => {
    // 1. Cross-filtering category state (null = all domains)
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

    // 2. Global Analytics Filter state
    const [filters, setFilters] = useState<AnalyticsFilterState>({
        timeRange: '30d',
        dayOfWeek: 'all',
        executionType: 'all',
    });

    // Normalize category colors to cohesive palette
    const normalizedCategories = useMemo(() => {
        return categories.map((cat, idx) => ({
            ...cat,
            color: HARMONIOUS_COLORS[idx % HARMONIOUS_COLORS.length],
        }));
    }, [categories]);

    // Currently filtered category object (if any)
    const activeCategory = useMemo(() => {
        if (!selectedCategoryKey) return null;
        return normalizedCategories.find((c) => c.key === selectedCategoryKey) || null;
    }, [selectedCategoryKey, normalizedCategories]);

    // Toggle category selection
    const handleToggleCategory = (catKey: string) => {
        setSelectedCategoryKey((prev) => (prev === catKey ? null : catKey));
    };

    const handleResetCategoryFilter = () => {
        setSelectedCategoryKey(null);
    };

    // Category filtered base heatmap
    const categoryFilteredHeatmap = useMemo(() => {
        if (!activeCategory) return heatmapActivities;
        return generateCategoryActivityHeatmap(tasks, challenges, activeCategory.name, 52);
    }, [activeCategory, tasks, challenges, heatmapActivities]);

    // Apply Global Filters (Time horizon, Day of week, Execution Type)
    const dynamicActivities = useMemo(() => {
        return filterActivities(categoryFilteredHeatmap, filters);
    }, [categoryFilteredHeatmap, filters]);

    // Determine window days based on filters.timeRange
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

    // Efficiency calculations
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
