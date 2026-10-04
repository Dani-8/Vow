import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

interface ChartDataItem {
    dayIndex: number;
    label: string;
    date: string;
    currentActions: number;
    prevActions: number;
    currentCumulative: number;
    prevCumulative: number;
}

interface MomentumTrajectoryChartProps {
    chartData: ChartDataItem[];
    effectiveDays: number;
    currentTotal: number;
    prevTotal: number;
}

export const MomentumTrajectoryChart: React.FC<MomentumTrajectoryChartProps> = ({
    chartData,
    effectiveDays,
    currentTotal,
    prevTotal,
}) => {
    return (
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
