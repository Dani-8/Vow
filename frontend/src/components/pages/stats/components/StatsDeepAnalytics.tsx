import React, { useState } from 'react';
import { CategoryBreakdownItem, DayActivity } from '../statsHelpers';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import {
    TrendingUp,
    Compass,
    ShieldCheck,
    Flame,
    BarChart3,
    PieChart as PieIcon,
    Layers,
    Activity,
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
}) => {
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

    // Normalize category colors to cohesive palette
    const normalizedCategories = categories.map((cat, idx) => ({
        ...cat,
        color: HARMONIOUS_COLORS[idx % HARMONIOUS_COLORS.length],
    }));

    // Efficiency calculations
    const sortedByEfficiency = [...normalizedCategories].sort((a, b) => {
        const effA = a.itemCount > 0 ? a.completedCount / a.itemCount : 0;
        const effB = b.itemCount > 0 ? b.completedCount / b.itemCount : 0;
        return effB - effA;
    });

    const highestEfficiency = sortedByEfficiency[0];
    const highestVolume = [...normalizedCategories].sort((a, b) => b.itemCount - a.itemCount)[0];