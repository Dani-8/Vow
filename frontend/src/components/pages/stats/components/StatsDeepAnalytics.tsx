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