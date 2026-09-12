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
}

export const StatsMomentumEngine: React.FC<StatsMomentumEngineProps> = ({
    heatmapActivities,
    overview,
    activeCategoryFilter,
    onResetCategoryFilter,
}) => {
    // 1. Calculate the Rolling 30 Days (Current 30 vs Previous 30)
    // heatmapActivities is sorted from oldest (52 weeks ago) to newest (today)
    const { chartData, currentTotal, prevTotal, growthPercent, trendState, currentActiveDays } = useMemo(() => {
        const totalLen = heatmapActivities.length;
        // Last 30 days = current window
        const currentWindow = heatmapActivities.slice(Math.max(0, totalLen - 30));
        // Previous 30 days before that = benchmark window
        const prevWindow = heatmapActivities.slice(
            Math.max(0, totalLen - 60),
            Math.max(0, totalLen - 30)
        );

        let curSum = 0;
        let pSum = 0;
        let curActive = 0;

        // Construct 30 day comparison array: Day 1 to Day 30
        const data = [];
        for (let i = 0; i < 30; i++) {
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
    }, [heatmapActivities]);

    // Discipline momentum score (0 - 100) based on active days out of 30, master streak, and output
    const momentumScore = useMemo(() => {
        const baseScore = Math.min(60, Math.round((currentActiveDays / 30) * 60));
        const streakBonus = Math.min(25, (overview.masterStreak || 1) * 3);
        const volumeBonus = Math.min(15, Math.round((currentTotal / 25) * 15));
        return Math.min(100, Math.max(15, baseScore + streakBonus + volumeBonus));
    }, [currentActiveDays, overview.masterStreak, currentTotal]);

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
                                Rolling 30 Days
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
                                : "Real-time trajectory: Your current 30-day discipline vs. your previous month's baseline"}
                        </p>
                    </div>
                </div>