import React, { useState, useMemo } from 'react';
import {
    CategoryBreakdownItem,
    DayActivity,
    EcosystemOverview,
    generateCategoryActivityHeatmap,
} from '../statsHelpers';
import { Task, Challenge } from '../../../../types';
import { TaskMap } from '../../task-map/types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { StatsMomentumEngine } from './StatsMomentumEngine';
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
    // Cross-filtering active state: null means all categories (no filter), string is the category key
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

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

    // Toggle category selection (like PowerBI cross-filter: clicking selected resets to all)
    const handleToggleCategory = (catKey: string) => {
        setSelectedCategoryKey((prev) => (prev === catKey ? null : catKey));
    };

    const handleResetFilter = () => {
        setSelectedCategoryKey(null);
    };

    // Filtered or full heatmap activities based on active category
    const dynamicHeatmapActivities = useMemo(() => {
        if (!activeCategory) return heatmapActivities;
        return generateCategoryActivityHeatmap(tasks, challenges, activeCategory.name, 52);
    }, [activeCategory, tasks, challenges, heatmapActivities]);

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

    // 1. Radar Chart Data: Volume Focus vs Completion Strength (%)
    const radarData = useMemo(() => {
        return normalizedCategories.slice(0, 6).map((cat) => {
            const strengthPercent =
                cat.itemCount > 0 ? Math.round((cat.completedCount / cat.itemCount) * 100) : 0;
            return {
                category: cat.name.split(' ')[0], // Short name for clean axis display
                fullName: cat.name,
                focusVolume: cat.itemCount,
                completionStrength: strengthPercent,
                key: cat.key,
                isSelected: selectedCategoryKey === cat.key,
            };
        });
    }, [normalizedCategories, selectedCategoryKey]);

    // 2. Category Stacked/Grouped Bar Chart Data
    const barData = useMemo(() => {
        return normalizedCategories.map((cat) => ({
            name: cat.name.split(' ')[0],
            fullName: cat.name,
            key: cat.key,
            completed: cat.completedCount,
            pending: Math.max(0, cat.itemCount - cat.completedCount),
            total: cat.itemCount,
            color: cat.color,
            isSelected: selectedCategoryKey === cat.key,
        }));
    }, [normalizedCategories, selectedCategoryKey]);

    // 3. Weekly Trend Data (Past 8 weeks) - dynamically reacts to cross-filtering
    const weeklyTrend = useMemo(() => {
        const last8WeeksMap: Record<number, { weekLabel: string; actions: number; challengeLogs: number }> = {};
        const maxWeekIndex = Math.max(...dynamicHeatmapActivities.map((a) => a.weekIndex), 0);
        const minWeekIndex = Math.max(0, maxWeekIndex - 7);

        for (let w = minWeekIndex; w <= maxWeekIndex; w++) {
            const weekDays = dynamicHeatmapActivities.filter((a) => a.weekIndex === w);
            const total = weekDays.reduce((sum, d) => sum + d.totalActions, 0);
            const challengeLogs = weekDays.reduce((sum, d) => sum + d.challengeActions, 0);
            const firstDay = weekDays[0]?.displayDate.split(',')[0] || `Wk ${w + 1}`;
            last8WeeksMap[w] = { weekLabel: firstDay, actions: total, challengeLogs };
        }
        return Object.values(last8WeeksMap);
    }, [dynamicHeatmapActivities]);

    return (
        <div className="space-y-6">
            {/* Cross-Filter Global Notification Bar (PowerBI style) */}
            {activeCategory && (
                <div className="neu-card p-3.5 rounded-2xl flex items-center justify-between border-2 border-[#549acb]/40 bg-[#E0E5EC] animate-fadeIn">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-white bg-[#549acb]">
                            <Filter className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xs font-black text-[#1a1c35] flex items-center space-x-1.5">
                                <span>Cross-Filtered by:</span>
                                <span
                                    className="px-2 py-0.5 rounded-md text-white font-bold"
                                    style={{ backgroundColor: activeCategory.color }}
                                >
                                    {activeCategory.name}
                                </span>
                            </span>
                            <p className="text-[11px] text-[#717699] font-medium">
                                All cadence curves, momentum trajectories, and stats below are isolated to this domain.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleResetFilter}
                        className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1 transition-all"
                    >
                        <span>Reset to All</span>
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Hero Discipline & Momentum Arc: Score + Trend + 30-Day Dual Wave Trajectory */}
            <StatsMomentumEngine
                heatmapActivities={dynamicHeatmapActivities}
                overview={overview}
                activeCategoryFilter={activeCategory ? activeCategory.name : null}
                onResetCategoryFilter={handleResetFilter}
            />

            {/* Top 3 Executive Takeaway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    onClick={() => highestVolume && handleToggleCategory(highestVolume.key)}
                    className={`neu-card p-5 rounded-3xl space-y-2 border cursor-pointer transition-all ${selectedCategoryKey === highestVolume?.key
                        ? 'ring-2 ring-[#549acb] shadow-md border-transparent'
                        : 'border-white/60 hover:scale-[1.01]'
                        }`}
                >
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
                        Highest concentration of active challenges, visual task maps, and routines. Click to filter.
                    </p>
                </div>

                <div
                    onClick={() => highestEfficiency && handleToggleCategory(highestEfficiency.key)}
                    className={`neu-card p-5 rounded-3xl space-y-2 border cursor-pointer transition-all ${selectedCategoryKey === highestEfficiency?.key
                        ? 'ring-2 ring-emerald-500 shadow-md border-transparent'
                        : 'border-white/60 hover:scale-[1.01]'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Highest Follow-Through</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-emerald-600">
                            {highestEfficiency
                                ? Math.round((highestEfficiency.completedCount / highestEfficiency.itemCount) * 100)
                                : 0}% Rate
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        {highestEfficiency?.name || 'Tech & Engineering'}
                    </div>
                    <p className="text-xs text-[#717699] font-medium">
                        Strongest completion discipline across roadmap goals and check-ins. Click to filter.
                    </p>
                </div>

                <div className="neu-card p-5 rounded-3xl space-y-2 border border-white/60">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#6366f1] flex items-center space-x-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#6366f1]" />
                            <span>Cadence & Velocity</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#6366f1]">
                            {activeCategory ? activeCategory.name.split(' ')[0] : 'Unified'}
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        {activeCategory ? `${activeCategory.completedCount} Completed` : 'Execution Balance'}
                    </div>
                    <p className="text-xs text-[#717699] font-medium">
                        {activeCategory
                            ? `${activeCategory.itemCount} total registered items under this pillar.`
                            : 'Weekly action rate remains continuous with no extended lapse periods.'}
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
                                    <h3 className="text-base font-black text-[#1a1c35] flex items-center space-x-2">
                                        <span>Domain Performance Radar</span>
                                        {activeCategory && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full neu-inset text-[#549acb] font-bold">
                                                Active: {activeCategory.name}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-[#717699] font-medium">
                                        Click any category node or legend pill to cross-filter the dashboard
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
                                    tick={(props: any) => {
                                        const { x, y, payload } = props;
                                        const item = radarData.find((d) => d.category === payload.value);
                                        const isSelected = item?.isSelected;
                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                textAnchor="middle"
                                                fill={isSelected ? '#549acb' : '#44476A'}
                                                fontSize={isSelected ? 12 : 11}
                                                fontWeight={isSelected ? 900 : 700}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => item && handleToggleCategory(item.key)}
                                            >
                                                {payload.value}
                                                {isSelected ? ' ★' : ''}
                                            </text>
                                        );
                                    }}
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Target Volume"
                                    dataKey="focusVolume"
                                    stroke="#549acb"
                                    fill="#549acb"
                                    fillOpacity={activeCategory ? 0.4 : 0.25}
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
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#6366f1] bg-[#E0E5EC]">
                                    <PieIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[#1a1c35]">Focus Share (Donut)</h3>
                                    <p className="text-xs text-[#717699] font-medium">
                                        Click any slice or card to filter dashboard
                                    </p>
                                </div>
                            </div>

                            {activeCategory && (
                                <button
                                    onClick={handleResetFilter}
                                    className="text-[10px] px-2 py-0.5 rounded-lg neu-inset text-[#717699] hover:text-[#1a1c35] font-bold"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Recharts Pie / Donut with Click-To-Filter */}
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
                                        onClick={(entry: any) => {
                                            const key = entry?.payload?.key || entry?.key;
                                            if (key) handleToggleCategory(key);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {normalizedCategories.map((entry) => {
                                            const isSelected = selectedCategoryKey === entry.key;
                                            const isAnySelected = Boolean(selectedCategoryKey);
                                            return (
                                                <Cell
                                                    key={`cell-${entry.key}`}
                                                    fill={entry.color}
                                                    opacity={!isAnySelected || isSelected ? 1 : 0.35}
                                                    stroke={isSelected ? '#1a1c35' : '#E0E5EC'}
                                                    strokeWidth={isSelected ? 3 : 2}
                                                />
                                            );
                                        })}
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
                                    {activeCategory
                                        ? activeCategory.itemCount
                                        : normalizedCategories.reduce((s, c) => s + c.itemCount, 0)}
                                </span>
                                <span className="text-[9px] font-bold uppercase text-[#717699]">
                                    {activeCategory ? activeCategory.name.split(' ')[0] : 'Total Items'}
                                </span>
                            </div>
                        </div>

                        {/* Donut Legend Cards - Clickable to Cross-Filter */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {normalizedCategories.slice(0, 6).map((cat) => {
                                const isSelected = selectedCategoryKey === cat.key;
                                const isDimmed = selectedCategoryKey !== null && !isSelected;

                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => handleToggleCategory(cat.key)}
                                        className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left transition-all ${isSelected
                                            ? 'neu-button bg-[#E0E5EC] ring-2 ring-[#549acb]'
                                            : isDimmed
                                                ? 'neu-inset opacity-50 hover:opacity-100'
                                                : 'neu-inset bg-[#E0E5EC]/80 hover:bg-[#E0E5EC]'
                                            }`}
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[11px] font-bold text-[#1a1c35] truncate flex items-center justify-between">
                                                <span>{cat.name}</span>
                                                {isSelected && (
                                                    <span className="text-[9px] text-[#549acb] font-black">✓</span>
                                                )}
                                            </div>
                                            <div className="text-[9px] font-semibold text-[#717699]">
                                                {cat.percentage}% share
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
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
                                    Click any bar to filter whole dashboard
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

                    <div className="w-full h-64 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                onClick={(state: any) => {
                                    if (state && state.activePayload && state.activePayload[0]) {
                                        const key = state.activePayload[0].payload.key;
                                        if (key) handleToggleCategory(key);
                                    }
                                }}
                                className="cursor-pointer"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#44476A', fontSize: 11, fontWeight: 700 }}
                                    axisLine={{ stroke: '#CBD5E1' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#717699', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(val: any, name: any) => [val, name === 'completed' ? 'Conquered' : 'Pending']}
                                    contentStyle={{
                                        backgroundColor: '#E0E5EC',
                                        borderRadius: '14px',
                                        border: '1px solid #CBD5E1',
                                        boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                    }}
                                />
                                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]}>
                                    {barData.map((entry) => {
                                        const isSelected = selectedCategoryKey === entry.key;
                                        const isDimmed = selectedCategoryKey !== null && !isSelected;
                                        return (
                                            <Cell
                                                key={`bar-comp-${entry.key}`}
                                                fill="#10b981"
                                                opacity={isDimmed ? 0.35 : 1}
                                                stroke={isSelected ? '#1a1c35' : 'none'}
                                                strokeWidth={isSelected ? 2 : 0}
                                            />
                                        );
                                    })}
                                </Bar>
                                <Bar dataKey="pending" stackId="a" fill="#CBD5E1" radius={[6, 6, 0, 0]}>
                                    {barData.map((entry) => {
                                        const isSelected = selectedCategoryKey === entry.key;
                                        const isDimmed = selectedCategoryKey !== null && !isSelected;
                                        return (
                                            <Cell
                                                key={`bar-pend-${entry.key}`}
                                                fill="#CBD5E1"
                                                opacity={isDimmed ? 0.35 : 1}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. 8-Week Velocity Area Trend - Dynamically Cross-Filtered */}
                <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35] flex items-center space-x-2">
                                    <span>Weekly Execution Cadence</span>
                                    {activeCategory && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full neu-inset text-[#549acb] font-bold">
                                            {activeCategory.name.split(' ')[0]}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    {activeCategory
                                        ? `Action output volume specifically for ${activeCategory.name}`
                                        : 'Action output volume across all domains over the last 8 weeks'}
                                </p>
                            </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] font-black text-[#549acb]">
                            8-Wk Window
                        </span>
                    </div>

                    <div className="w-full h-64 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={activeCategory ? activeCategory.color : '#549acb'}
                                            stopOpacity={0.4}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={activeCategory ? activeCategory.color : '#549acb'}
                                            stopOpacity={0.0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                                <XAxis
                                    dataKey="weekLabel"
                                    tick={{ fill: '#44476A', fontSize: 10, fontWeight: 700 }}
                                    axisLine={{ stroke: '#CBD5E1' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#717699', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(val: any) => [
                                        `${val} actions completed`,
                                        activeCategory ? `${activeCategory.name} Velocity` : 'Weekly Velocity',
                                    ]}
                                    contentStyle={{
                                        backgroundColor: '#E0E5EC',
                                        borderRadius: '14px',
                                        border: '1px solid #CBD5E1',
                                        boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: '#1a1c35',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="actions"
                                    stroke={activeCategory ? activeCategory.color : '#549acb'}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVelocity)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
