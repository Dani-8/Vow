import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
    BarChart,
    Bar,
    LabelList,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface BarDataItem {
    name: string;
    fullName: string;
    key: string;
    completed: number;
    pending: number;
    total: number;
    completedPct: number;
    pendingPct: number;
    color: string;
    isSelected: boolean;
}

interface AnalyticsBacklogBarProps {
    barData: BarDataItem[];
    selectedCategoryKey: string | null;
    onToggleCategory: (catKey: string) => void;
}

export const AnalyticsBacklogBar: React.FC<AnalyticsBacklogBarProps> = ({
    barData,
    selectedCategoryKey,
    onToggleCategory,
}) => {
    return (
        <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#10b981] bg-[#E0E5EC]">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-[#1a1c35]">
                            Conquered vs. Pending Backlog
                        </h3>
                        <p className="text-xs text-[#717699] font-medium">
                            Click any bar to filter whole dashboard
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] font-bold">
                    <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        <span className="text-[#44476A]">Conquered</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
                        <span className="text-[#44476A]">Pending</span>
                    </span>
                </div>
            </div>

            <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={barData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        onClick={(state: any) => {
                            if (state && state.activePayload && state.activePayload[0]) {
                                const key = state.activePayload[0].payload.key;
                                if (key) onToggleCategory(key);
                            }
                        }}
                        className="cursor-pointer"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#44476A', fontSize: 11, fontWeight: 700 }}
                            axisLine={{ stroke: '#CBD5E1' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#717699', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={(val: any, name: any, item: any) => {
                                const payload = item?.payload;
                                if (name === 'completed') {
                                    return [`${val} items (${payload?.completedPct || 0}%)`, 'Conquered'];
                                }
                                return [`${val} items (${payload?.pendingPct || 0}%)`, 'Pending Backlog'];
                            }}
                            contentStyle={{
                                backgroundColor: '#E0E5EC',
                                borderRadius: '14px',
                                border: '1px solid #CBD5E1',
                                boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                fontSize: '11px',
                                fontWeight: 700,
                            }}
                        />
                        <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]}>
                            <LabelList
                                dataKey="completedPct"
                                position="center"
                                formatter={(val: number) => (val >= 12 ? `${val}%` : '')}
                                style={{
                                    fill: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                }}
                            />
                            {barData.map((entry) => {
                                const isSelected = selectedCategoryKey === entry.key;
                                const isDimmed = selectedCategoryKey !== null && !isSelected;
                                return (
                                    <Cell
                                        key={`bar-comp-${entry.key}`}
                                        fill="#10b981"
                                        opacity={isDimmed ? 0.35 : 1}
                                        stroke={isSelected ? '#1a1c35' : 'none'}
                                        strokeWidth={isSelected ? 2 : 0}
                                    />
                                );
                            })}
                        </Bar>
                        <Bar dataKey="pending" stackId="a" fill="#CBD5E1" radius={[6, 6, 0, 0]}>
                            <LabelList
                                dataKey="pendingPct"
                                position="center"
                                formatter={(val: number) => (val >= 12 ? `${val}%` : '')}
                                style={{
                                    fill: '#44476A',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                }}
                            />
                            {barData.map((entry) => {
                                const isSelected = selectedCategoryKey === entry.key;
                                const isDimmed = selectedCategoryKey !== null && !isSelected;
                                return (
                                    <Cell
                                        key={`bar-pend-${entry.key}`}
                                        fill="#CBD5E1"
                                        opacity={isDimmed ? 0.35 : 1}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
