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

    // 1. Radar Chart Data: Volume Focus vs Completion Strength (%)
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

    // 3. Weekly Execution Cadence Trend: DYNAMICALLY DICTATED BY GLOBAL RANGE
    // If 7d or 14d, break down by Days. If 30d+, group into appropriate weekly intervals.
    const cadenceTrend = useMemo(() => {
        // If range is short (7d or 14d), show day-by-day cadence
        if (currentWindowDays <= 14) {
            return dynamicActivities.slice(-currentWindowDays).map((d) => ({
                label: d.displayDate.split(',')[0],
                actions: d.totalActions,
                challengeLogs: d.challengeActions,
            }));
        }

        // For 30d to 90d, break into weeks
        const weeksToShow = Math.ceil(currentWindowDays / 7);
        const weeksMap: Record<number, { label: string; actions: number; challengeLogs: number }> = {};
        
        // Group activities by relative week from start of the window
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

    return (
        <div className="space-y-6">
            {/* 1. Global Analytics Control Bar (Time Horizon, Execution Type, Day-of-Week) */}
            <StatsControlBar
                filters={filters}
                onChangeFilters={setFilters}
                activeCategoryFilter={activeCategory ? activeCategory.name : null}
                onResetCategoryFilter={handleResetCategoryFilter}
            />

            {/* 2. Cross-Filter Domain Banner (PowerBI style) */}
            {activeCategory && (
                <div className="neu-card p-3.5 rounded-2xl flex items-center justify-between border-2 border-[#549acb]/40 bg-[#E0E5EC] animate-fadeIn">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-white bg-[#549acb]">
                            <Filter className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xs font-black text-[#1a1c35] flex items-center space-x-1.5">
                                <span>Domain Filter Active:</span>
                                <span
                                    className="px-2 py-0.5 rounded-md text-white font-bold"
                                    style={{ backgroundColor: activeCategory.color }}
                                >
                                    {activeCategory.name}
                                </span>
                            </span>
                            <p className="text-[11px] text-[#717699] font-medium">
                                All momentum curves, cadence waves, and metrics below are isolated to this domain.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleResetCategoryFilter}
                        className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1 transition-all"
                    >
                        <span>Reset Domain</span>
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* 3. Hero Discipline & Momentum Arc: Score + Trend + Dual Wave Trajectory */}
            <StatsMomentumEngine
                heatmapActivities={dynamicActivities}
                overview={overview}
                activeCategoryFilter={activeCategory ? activeCategory.name : null}
                onResetCategoryFilter={handleResetCategoryFilter}
                windowDays={currentWindowDays}
                rangeLabel={
                    filters.timeRange === 'custom'
                        ? 'Custom Range'
                        : `Rolling ${currentWindowDays} Days`
                }
            />

            {/* 4. Top 3 Executive Takeaway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    onClick={() => highestVolume && handleToggleCategory(highestVolume.key)}
                    className={`neu-card p-5 rounded-3xl space-y-2 border cursor-pointer transition-all ${
                        selectedCategoryKey === highestVolume?.key
                            ? 'ring-2 ring-[#549acb] shadow-md border-transparent'
                            : 'border-white/60 hover:scale-[1.01]'
                    }`}
                ></div>