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