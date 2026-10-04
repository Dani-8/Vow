import React from 'react';
import { Activity } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface CadenceItem {
    label: string;
    actions: number;
    challengeLogs: number;
}

interface AnalyticsCadenceAreaProps {
    cadenceTrend: CadenceItem[];
    currentWindowDays: number;
    activeCategoryName: string | null;
    activeCategoryColor: string;
}

export const AnalyticsCadenceArea: React.FC<AnalyticsCadenceAreaProps> = ({
    cadenceTrend,
    currentWindowDays,
    activeCategoryName,
    activeCategoryColor,
}) => {
    return (
        <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-[#1a1c35] flex items-center space-x-2">
                            <span>Execution Cadence</span>
                            {activeCategoryName && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full neu-inset text-[#549acb] font-bold">
                                    {activeCategoryName.split(' ')[0]}
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-[#717699] font-medium">
                            {currentWindowDays <= 14
                                ? `Day-by-day output volume for selected ${currentWindowDays}-day horizon`
                                : `Weekly pacing across the selected ${currentWindowDays}-day range`}
                        </p>
                    </div>
                </div>

                <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] font-black text-[#549acb]">
                    {currentWindowDays <= 14 ? `${currentWindowDays}D Daily` : `${Math.ceil(currentWindowDays / 7)} Wk Window`}
                </span>
            </div>

            <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cadenceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={activeCategoryColor}
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={activeCategoryColor}
                                    stopOpacity={0.0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                        <XAxis
                            dataKey="label"
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
                                activeCategoryName ? `${activeCategoryName} Output` : 'Action Output',
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
                            stroke={activeCategoryColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVelocity)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
