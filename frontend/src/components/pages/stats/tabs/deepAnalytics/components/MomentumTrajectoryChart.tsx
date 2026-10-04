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

                {/* Chart Legend */}
                <div className="flex items-center space-x-3 text-[11px] font-bold">
                    <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-0.5 bg-[#549acb] rounded-full" />
                        <span className="text-[#1a1c35]">Current ({effectiveDays}d)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-[#94a3b8]" />
                        <span className="text-[#717699]">Previous ({effectiveDays}d)</span>
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
                            labelFormatter={(label: any) => `Day ${label} of ${effectiveDays}`}
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
                        {/* Previous days (Dotted baseline) */}
                        <Area
                            type="monotone"
                            dataKey="prevActions"
                            name="prevActions"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fillOpacity={1}
                            fill="url(#prevWaveGradient)"
                        />
                        {/* Current days (Solid Brand Blue glow) */}
                        <Area
                            type="monotone"
                            dataKey="currentActions"
                            name="currentActions"
                            stroke="#549acb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#curWaveGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#717699] font-semibold px-2 pt-1 border-t border-slate-300/60">
                <span>Day 1 ({effectiveDays}d ago)</span>
                <span className="text-[#549acb] font-bold">
                    {currentTotal >= prevTotal
                        ? `🔥 Leading previous output by +${currentTotal - prevTotal} actions`
                        : `Target: ${prevTotal - currentTotal} more actions to top previous period`}
                </span>
                <span>Day {effectiveDays} (Today)</span>
            </div>
        </div>
    );
};
