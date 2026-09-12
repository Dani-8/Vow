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
