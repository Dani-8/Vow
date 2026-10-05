import React from 'react';
import { Info } from 'lucide-react';
import { DayActivity } from '../../../statsHelpers';

interface OverviewHeatmapLegendProps {
    hoveredDay: DayActivity | null;
    totalActions: number;
    activeDays: number;
    maxDayActions: number;
}

export const OverviewHeatmapLegend: React.FC<OverviewHeatmapLegendProps> = ({
    hoveredDay,
    totalActions,
    activeDays,
    maxDayActions,
}) => {
    return (
        <div className="space-y-4">
            {/* Active Tooltip / Detail Banner */}
            <div className="neu-inset p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-[#E0E5EC]/80 border border-white/60">
                {hoveredDay ? (
                    <div className="flex items-center space-x-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#549acb] animate-pulse" />
                        <span className="font-black text-[#1a1c35]">{hoveredDay.displayDate}:</span>
                        <span className="text-[#549acb] font-extrabold">
                            {hoveredDay.totalActions} total action{hoveredDay.totalActions === 1 ? '' : 's'}
                        </span>
                        <span className="text-[#717699]">
                            ({hoveredDay.challengeActions} challenge logs • {hoveredDay.taskActions} task actions)
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-[#717699] font-medium">
                        <Info className="w-4 h-4 text-[#549acb]" />
                        <span>Hover over any day square to see execution details.</span>
                    </div>
                )}

                {/* Legend */}
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#717699] shrink-0">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#d8dee8]/60 shadow-inner" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-sky-200" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#549acb]" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />
                    <span>More</span>
                </div>
            </div>

            {/* Bottom Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="neu-inset p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase text-[#717699] block">Total Executed Actions (1y)</span>
                    <span className="text-xl font-black text-[#1a1c35]">{totalActions}</span>
                </div>
                <div className="neu-inset p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase text-[#717699] block">Active Execution Days</span>
                    <span className="text-xl font-black text-emerald-600">{activeDays} Days</span>
                </div>
                <div className="neu-inset p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold uppercase text-[#717699] block">Peak Day Volume</span>
                    <span className="text-xl font-black text-[#549acb]">{maxDayActions} Actions</span>
                </div>
            </div>
        </div>
    );
};
