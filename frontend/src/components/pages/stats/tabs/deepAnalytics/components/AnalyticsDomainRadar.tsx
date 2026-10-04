import React from 'react';
import { Compass } from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface RadarItem {
    category: string;
    fullName: string;
    focusVolume: number;
    completionStrength: number;
    key: string;
    isSelected: boolean;
}

interface AnalyticsDomainRadarProps {
    radarData: RadarItem[];
    activeCategoryName: string | null;
    isCategoryActive: boolean;
    onToggleCategory: (key: string) => void;
}

export const AnalyticsDomainRadar: React.FC<AnalyticsDomainRadarProps> = ({
    radarData,
    activeCategoryName,
    isCategoryActive,
    onToggleCategory,
}) => {
    return (
        <div className="lg:col-span-7 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1a1c35] flex items-center space-x-2">
                                <span>Domain Performance Radar</span>
                                {activeCategoryName && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full neu-inset text-[#549acb] font-bold">
                                        Active: {activeCategoryName}
                                    </span>
                                )}
                            </h3>
                            <p className="text-xs text-[#717699] font-medium">
                                Click any category node to cross-filter the dashboard
                            </p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center space-x-3 text-[11px] font-bold">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#549acb]" />
                            <span className="text-[#44476A]">Target Volume</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                            <span className="text-[#44476A]">Completion %</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recharts Radar */}
            <div className="w-full h-72 py-1">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={(props: any) => {
                                const { x, y, payload } = props;
                                const item = radarData.find((d) => d.category === payload.value);
                                const isSelected = item?.isSelected;
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        fill={isSelected ? '#549acb' : '#44476A'}
                                        fontSize={isSelected ? 12 : 11}
                                        fontWeight={isSelected ? 900 : 700}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => item && onToggleCategory(item.key)}
                                    >
                                        {payload.value}
                                        {isSelected ? ' ★' : ''}
                                    </text>
                                );
                            }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar
                            name="Target Volume"
                            dataKey="focusVolume"
                            stroke="#549acb"
                            fill="#549acb"
                            fillOpacity={isCategoryActive ? 0.4 : 0.25}
                            strokeWidth={2}
                        />
                        <Radar
                            name="Completion %"
                            dataKey="completionStrength"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#E0E5EC',
                                borderRadius: '16px',
                                border: '1px solid #CBD5E1',
                                boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#1a1c35',
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-[#717699] text-center font-medium">
                Blue shape charts effort volume across life domains; green shape plots actual finish rate percentage.
            </p>
        </div>
    );
};
