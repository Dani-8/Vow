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

                {/* Live Dynamic Trend Indicator */}
                <div className="flex items-center space-x-2">
                    {trendState === 'rising' && (
                        <span className="px-3 py-1.5 rounded-xl neu-inset text-xs font-black text-emerald-600 flex items-center space-x-1.5 bg-[#E0E5EC]/90">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span>Surging (+{growthPercent}% vs Last Mo)</span>
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

            {/* Split Content: Left Metric Command Block (35%) + Right 30-Day Dual Wave Chart (65%) */}
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

                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-black text-[#1a1c35] tracking-tight">
                                {momentumScore}
                            </span>
                            <span className="text-sm font-bold text-[#717699]">/ 100</span>
                        </div>

                        {/* Progress Bar Gauge */}
                        <div className="w-full h-2 rounded-full neu-inset overflow-hidden p-0.5">
                            <div
                                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#549acb] to-emerald-500"
                                style={{ width: `${momentumScore}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-[11px] font-bold text-[#717699] pt-1 border-t border-slate-300/70">
                            <span>30-Day Active Pace:</span>
                            <span className="text-[#1a1c35] font-black">{currentActiveDays} of 30 Days</span>
                        </div>
                    </div>

                    {/* Psychology Coaching Cue */}
                    <div className="neu-card p-4 rounded-2xl border border-white/60 text-xs space-y-2">
                        <div className="flex items-center space-x-2 font-black text-[#1a1c35]">
                            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>Cadence Psychology</span>
                        </div>

                        {trendState === 'rising' && (
                            <p className="text-[#44476A] font-medium leading-relaxed">
                                {activeCategoryFilter ? (
                                    <>In <strong className="text-[#1a1c35]">{activeCategoryFilter}</strong>, you are outpacing your baseline by <strong className="text-emerald-600 font-bold">+{growthPercent}%</strong>. This domain is compounding fast.</>
                                ) : (
                                    <>You are outperforming your previous 30-day pace by <strong className="text-emerald-600 font-bold">+{growthPercent}%</strong>. Your unbroken discipline is compounding into permanent routine.</>
                                )}
                            </p>
                        )}
                        {trendState === 'steady' && (
                            <p className="text-[#44476A] font-medium leading-relaxed">
                                {activeCategoryFilter ? (
                                    <>Consistent execution in <strong className="text-[#1a1c35]">{activeCategoryFilter}</strong> with <strong className="text-[#549acb] font-bold">{currentTotal} actions</strong> logged.</>
                                ) : (
                                    <>Stable cadence. You have sustained <strong className="text-[#549acb] font-bold">{currentTotal} actions</strong> across challenges and habits. One extra check-in today initiates a growth surge.</>
                                )}
                            </p>
                        )}
                        {trendState === 'cooling' && (
                            <p className="text-[#44476A] font-medium leading-relaxed">
                                {activeCategoryFilter ? (
                                    <>A pause in <strong className="text-[#1a1c35]">{activeCategoryFilter}</strong>. A single log or task completion today will reignite momentum in this domain.</>
                                ) : (
                                    <>A slight pace breather detected. Non-punitive rule: <strong className="text-[#549acb] font-bold">just 1 micro-task or challenge log today</strong> bends your trajectory back upward.</>
                                )}
                            </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] font-extrabold text-[#717699] pt-1.5 border-t border-slate-200">
                            <span>This Mo: <strong className="text-[#1a1c35]">{currentTotal} actions</strong></span>
                            <span>Past Mo: <strong className="text-[#717699]">{prevTotal} actions</strong></span>
                        </div>
                    </div>
                </div>

                {/* 2. Right 30-Day Dual Wave Trajectory Chart (8 cols) */}
                <div className="lg:col-span-8 neu-inset p-5 rounded-3xl bg-[#E0E5EC]/80 border border-white/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                        <div>
                            <h4 className="text-xs font-black text-[#1a1c35] uppercase tracking-wider">
                                Trajectory Comparison Curve
                            </h4>
                            <span className="text-[10px] text-[#717699] font-medium">
                                Day-by-day output volume compared against your past self
                            </span>
                        </div>

                        {/* Chart Legend */}
                        <div className="flex items-center space-x-3 text-[11px] font-bold">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-3 h-0.5 bg-[#549acb] rounded-full" />
                                <span className="text-[#1a1c35]">Current 30 Days</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <span className="w-3 h-0.5 border-t-2 border-dashed border-[#94a3b8]" />
                                <span className="text-[#717699]">Previous 30 Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Dual Wave Area Chart */}
                    <div className="w-full h-60 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="curWaveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#549acb" stopOpacity={0.45} />
                                        <stop offset="95%" stopColor="#549acb" stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="prevWaveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                                <XAxis
                                    dataKey="dayIndex"
                                    tick={{ fill: '#44476A', fontSize: 10, fontWeight: 700 }}
                                    axisLine={{ stroke: '#CBD5E1' }}
                                    tickLine={false}
                                    tickFormatter={(v) => `D${v}`}
                                />
                                <YAxis
                                    tick={{ fill: '#717699', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `${value} actions`,
                                        name === 'currentActions' ? 'Current Period' : 'Previous Period',
                                    ]}
                                    labelFormatter={(label: any) => `Day ${label} of 30`}
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