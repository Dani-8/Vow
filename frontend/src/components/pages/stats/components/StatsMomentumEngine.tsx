import React, { useMemo } from 'react';
import { DayActivity, EcosystemOverview } from '../statsHelpers';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Zap,
    Sparkles,
    Flame,
    X,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

interface StatsMomentumEngineProps {
    heatmapActivities: DayActivity[];
    overview: EcosystemOverview;
    activeCategoryFilter?: string | null;
    onResetCategoryFilter?: () => void;
    windowDays?: number;
    rangeLabel?: string;
}

export const StatsMomentumEngine: React.FC<StatsMomentumEngineProps> = ({
    heatmapActivities,
    overview,
    activeCategoryFilter,
    onResetCategoryFilter,
    windowDays = 30,
    rangeLabel,
}) => {
    // 1. Calculate Rolling Window (Current N days vs Previous N days)
    const effectiveDays = Math.max(7, Math.min(windowDays, 90));

    const { chartData, currentTotal, prevTotal, growthPercent, trendState, currentActiveDays } = useMemo(() => {
        const totalLen = heatmapActivities.length;
        // Current window
        const currentWindow = heatmapActivities.slice(Math.max(0, totalLen - effectiveDays));
        // Benchmark window immediately preceding current
        const prevWindow = heatmapActivities.slice(
            Math.max(0, totalLen - (effectiveDays * 2)),
            Math.max(0, totalLen - effectiveDays)
        );

        let curSum = 0;
        let pSum = 0;
        let curActive = 0;

        const count = Math.min(effectiveDays, currentWindow.length || effectiveDays);
        const data = [];

        for (let i = 0; i < count; i++) {
            const curDay = currentWindow[i];
            const prevDay = prevWindow[i];

            const curActions = curDay ? curDay.totalActions : 0;
            const prevActions = prevDay ? prevDay.totalActions : 0;

            curSum += curActions;
            pSum += prevActions;

            if (curActions > 0) curActive++;

            data.push({
                dayIndex: i + 1,
                label: `Day ${i + 1}`,
                date: curDay ? curDay.displayDate.split(',')[0] : `Day ${i + 1}`,
                currentActions: curActions,
                prevActions: prevActions,
                currentCumulative: curSum,
                prevCumulative: pSum,
            });
        }

        let growth = 0;
        if (pSum > 0) {
            growth = Math.round(((curSum - pSum) / pSum) * 100);
        } else if (curSum > 0) {
            growth = 100;
        }

        let trend: 'rising' | 'steady' | 'cooling' = 'steady';
        if (growth >= 5 || (curSum >= pSum && curSum > 0)) {
            trend = 'rising';
        } else if (growth <= -10) {
            trend = 'cooling';
        } else {
            trend = 'steady';
        }

        return {
            chartData: data,
            currentTotal: curSum,
            prevTotal: pSum,
            growthPercent: growth,
            trendState: trend,
            currentActiveDays: curActive,
        };
    }, [heatmapActivities, effectiveDays]);

    // Discipline momentum score (0 - 100)
    const momentumScore = useMemo(() => {
        const baseScore = Math.min(60, Math.round((currentActiveDays / effectiveDays) * 60));
        const streakBonus = Math.min(25, (overview.masterStreak || 1) * 3);
        const volumeBonus = Math.min(15, Math.round((currentTotal / (effectiveDays * 0.8)) * 15));
        return Math.min(100, Math.max(15, baseScore + streakBonus + volumeBonus));
    }, [currentActiveDays, overview.masterStreak, currentTotal, effectiveDays]);

    const titleWindowLabel = rangeLabel || `Rolling ${effectiveDays} Days`;

    return (
        <div className="neu-card p-6 rounded-3xl space-y-5 border border-white/60 bg-[#E0E5EC]">
            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-300/60 pb-3.5">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                        <Zap className="w-5 h-5 fill-[#549acb]/20" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-base font-black text-[#1a1c35]">
                                Momentum & Discipline Arc
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full neu-inset text-[#549acb] font-extrabold uppercase tracking-wider">
                                {titleWindowLabel}
                            </span>
                            {activeCategoryFilter && (
                                <button
                                    onClick={onResetCategoryFilter}
                                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#549acb] text-white font-extrabold flex items-center space-x-1 shadow-sm hover:opacity-90 transition-opacity"
                                    title="Click to reset filter back to all categories"
                                >
                                    <span>Filtered: {activeCategoryFilter}</span>
                                    <X className="w-3 h-3 ml-0.5" />
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-[#717699] font-medium">
                            {activeCategoryFilter
                                ? `Showing dedicated discipline & velocity solely for ${activeCategoryFilter}`
                                : `Real-time trajectory: Your current ${effectiveDays}-day discipline vs. your previous period baseline`}
                        </p>
                    </div>
                </div>

                {/* Live Dynamic Trend Indicator */}
                <div className="flex items-center space-x-2">
                    {trendState === 'rising' && (
                        <span className="px-3 py-1.5 rounded-xl neu-inset text-xs font-black text-emerald-600 flex items-center space-x-1.5 bg-[#E0E5EC]/90">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span>Surging (+{growthPercent}% vs Prior Period)</span>
                        </span>
                    )}
                    {trendState === 'steady' && (
                        <span className="px-3 py-1.5 rounded-xl neu-inset text-xs font-black text-[#549acb] flex items-center space-x-1.5 bg-[#E0E5EC]/90">
                            <Minus className="w-4 h-4 text-[#549acb]" />
                            <span>Solid Cadence ({growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`})</span>
                        </span>
                    )}
                    {trendState === 'cooling' && (
                        <span className="px-3 py-1.5 rounded-xl neu-inset text-xs font-black text-amber-600 flex items-center space-x-1.5 bg-[#E0E5EC]/90">
                            <TrendingDown className="w-4 h-4 text-amber-600" />
                            <span>Slight Dip ({growthPercent}%)</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Split Content: Left Metric Command Block (35%) + Right Dual Wave Chart (65%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 1. Left Command Block (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Score Inset Display */}
                    <div className="neu-inset p-5 rounded-3xl bg-[#E0E5EC]/80 border border-white/60 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#717699]">
                                Discipline Momentum Index
                            </span>
                            <span className="text-xs font-extrabold text-[#549acb] flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{overview.consistencyGrade}</span>
                            </span>
                        </div>