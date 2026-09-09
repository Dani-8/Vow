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

    // 1. Radar Chart Data: Volume Focus vs Completion Strength (%)
    const radarData = normalizedCategories.slice(0, 6).map((cat) => {
        const strengthPercent = cat.itemCount > 0 ? Math.round((cat.completedCount / cat.itemCount) * 100) : 0;
        return {
            category: cat.name.split(' ')[0], // Short name for clean axis display
            fullName: cat.name,
            focusVolume: cat.itemCount,
            completionStrength: strengthPercent,
            key: cat.key,
        };
    });

    // 2. Category Stacked/Grouped Bar Chart Data
    const barData = normalizedCategories.map((cat) => ({
        name: cat.name.split(' ')[0],
        fullName: cat.name,
        completed: cat.completedCount,
        pending: Math.max(0, cat.itemCount - cat.completedCount),
        total: cat.itemCount,
        color: cat.color,
    }));

    // 3. Weekly Trend Data (Past 8 weeks)
    const last8WeeksMap: Record<number, { weekLabel: string; actions: number; challengeLogs: number }> = {};
    const maxWeekIndex = Math.max(...heatmapActivities.map((a) => a.weekIndex), 0);
    const minWeekIndex = Math.max(0, maxWeekIndex - 7);

    for (let w = minWeekIndex; w <= maxWeekIndex; w++) {
        const weekDays = heatmapActivities.filter((a) => a.weekIndex === w);
        const total = weekDays.reduce((sum, d) => sum + d.totalActions, 0);
        const challengeLogs = weekDays.reduce((sum, d) => sum + d.challengeActions, 0);
        const firstDay = weekDays[0]?.displayDate.split(',')[0] || `Wk ${w + 1}`;
        last8WeeksMap[w] = { weekLabel: firstDay, actions: total, challengeLogs };
    }

    const weeklyTrend = Object.values(last8WeeksMap);

    const selectedCategory =
        normalizedCategories.find((c) => c.key === selectedCategoryKey) || normalizedCategories[0];

    return (
        <div className="space-y-6">
            {/* Top 3 Executive Takeaway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="neu-card p-5 rounded-3xl space-y-2 border border-white/60">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#549acb] flex items-center space-x-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#549acb]" />
                            <span>Primary Energy Focus</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#44476A]">
                            {highestVolume?.percentage || 0}% Volume
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        {highestVolume?.name || 'Habits & Routine'}
                    </div>
                    <p className="text-xs text-[#717699] font-medium">
                        Highest concentration of active challenges, visual task maps, and routines.
                    </p>
                </div>

                <div className="neu-card p-5 rounded-3xl space-y-2 border border-white/60">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Highest Follow-Through</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-emerald-600">
                            {highestEfficiency ? Math.round((highestEfficiency.completedCount / highestEfficiency.itemCount) * 100) : 0}% Rate
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        {highestEfficiency?.name || 'Tech & Engineering'}
                    </div>
                    <p className="text-xs text-[#717699] font-medium">
                        Strongest completion discipline across roadmap goals and check-ins.
                    </p>
                </div>