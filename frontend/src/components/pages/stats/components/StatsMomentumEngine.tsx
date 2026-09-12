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
