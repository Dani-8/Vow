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

                <div className="neu-card p-5 rounded-3xl space-y-2 border border-white/60">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#6366f1] flex items-center space-x-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#6366f1]" />
                            <span>Cadence & Velocity</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#6366f1]">
                            Consistent
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        Execution Balance
                    </div>
                    <p className="text-xs text-[#717699] font-medium">
                        Weekly action rate remains continuous with no extended lapse periods.
                    </p>
                </div>
            </div>

            {/* Row 1: Interactive Recharts Radar Chart + Category Share Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Life Balance Radar Chart (7 cols) */}
                <div className="lg:col-span-7 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                                    <Compass className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[#1a1c35]">
                                        Domain Performance Radar
                                    </h3>
                                    <p className="text-xs text-[#717699] font-medium">
                                        Multi-axis spider graph: Target Volume vs. Completion Strength
                                    </p>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center space-x-3 text-[11px] font-bold">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#549acb]" />
                                    <span className="text-[#44476A]">Target Volume</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                                    <span className="text-[#44476A]">Completion %</span>
                                </div>
                            </div>
                        </div>
                </div>

                    {/* Recharts Radar */}
                    <div className="w-full h-72 py-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                                <PolarAngleAxis
                                    dataKey="category"
                                    tick={{ fill: '#44476A', fontSize: 11, fontWeight: 700 }}
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Target Volume"
                                    dataKey="focusVolume"
                                    stroke="#549acb"
                                    fill="#549acb"
                                    fillOpacity={0.25}
                                    strokeWidth={2}
                                />
                                <Radar
                                    name="Completion %"
                                    dataKey="completionStrength"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#E0E5EC',
                                        borderRadius: '16px',
                                        border: '1px solid #CBD5E1',
                                        boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: '#1a1c35',
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <p className="text-[11px] text-[#717699] text-center font-medium">
                        Blue shape charts your effort volume across life domains; green shape plots your actual finish rate percentage.
                    </p>
                </div>

                {/* 2. Donut Pie Chart: Category Focus Allocation (5 cols) */}
                <div className="lg:col-span-5 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#6366f1] bg-[#E0E5EC]">
                                <PieIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35]">Focus Share (Donut)</h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    Proportional energy allocation
                                </p>
                            </div>
                        </div>

                        {/* Recharts Pie / Donut */}
                        <div className="w-full h-52 relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={normalizedCategories}
                                        dataKey="itemCount"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        stroke="#E0E5EC"
                                        strokeWidth={2}
                                    >
                                        {normalizedCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: any, name: any) => [`${val} items`, name]}
                                        contentStyle={{
                                            backgroundColor: '#E0E5EC',
                                            borderRadius: '14px',
                                            border: '1px solid #CBD5E1',
                                            boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Donut Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-black text-[#1a1c35]">
                                    {normalizedCategories.reduce((s, c) => s + c.itemCount, 0)}
                                </span>
                                <span className="text-[9px] font-bold uppercase text-[#717699]">
                                    Total Items
                                </span>
                            </div>
                        </div>

                        {/* Donut Legend */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {normalizedCategories.slice(0, 6).map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategoryKey(cat.key)}
                                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left transition-all ${
                                        selectedCategory?.key === cat.key
                                            ? 'neu-button bg-[#E0E5EC]'
                                            : 'neu-inset bg-[#E0E5EC]/80 hover:bg-[#E0E5EC]'
                                    }`}
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[11px] font-bold text-[#1a1c35] truncate">
                                            {cat.name}
                                        </div>
                                        <div className="text-[9px] font-semibold text-[#717699]">
                                            {cat.percentage}% share
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Category Conquered vs Pending Bar Chart + 8-Week Cadence Area Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Stacked Bar Chart */}
                <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#10b981] bg-[#E0E5EC]">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35]">
                                    Conquered vs. Pending Backlog
                                </h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    Item completion volume per category
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] font-bold">
                            <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                                <span className="text-[#44476A]">Conquered</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
                                <span className="text-[#44476A]">Pending</span>
                            </span>
                        </div>
                    </div>