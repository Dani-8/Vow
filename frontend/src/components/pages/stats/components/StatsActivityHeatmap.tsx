import React, { useState, useMemo } from 'react';
import { Calendar, Info } from 'lucide-react';
import { DayActivity } from '../statsHelpers';

interface StatsActivityHeatmapProps {
    activities: DayActivity[];
}

export const StatsActivityHeatmap: React.FC<StatsActivityHeatmapProps> = ({ activities }) => {
    const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'challenges' | 'tasks'>('all');

    // Group activities by week index
    const weeks: DayActivity[][] = useMemo(() => {
        const grouped: DayActivity[][] = [];
        activities.forEach((day) => {
            if (!grouped[day.weekIndex]) {
                grouped[day.weekIndex] = [];
            }
            grouped[day.weekIndex].push(day);
        });
        return grouped;
    }, [activities]);

    // Compute month headers positioned at the week index where each month begins
    const monthLabels = useMemo(() => {
        const labels: { name: string; weekIndex: number }[] = [];
        let lastMonth = '';

        weeks.forEach((week, wIndex) => {
            // Check the first day in this week
            const firstDay = week[0];
            if (firstDay) {
                // Parse date string (YYYY-MM-DD)
                const parts = firstDay.date.split('-');
                if (parts.length >= 2) {
                    const monthKey = `${parts[0]}-${parts[1]}`;
                    if (monthKey !== lastMonth) {
                        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
                        const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                        labels.push({ name: monthName, weekIndex: wIndex });
                        lastMonth = monthKey;
                    }
                }
            }
        });
        return labels;
    }, [weeks]);

    // Compute stats
    const totalActions = activities.reduce((sum, d) => sum + d.totalActions, 0);
    const activeDays = activities.filter((d) => d.totalActions > 0).length;
    const maxDayActions = activities.reduce((max, d) => Math.max(max, d.totalActions), 0);

    const getCellColorClass = (day: DayActivity): string => {
        const count =
            activeFilter === 'all'
                ? day.totalActions
                : activeFilter === 'challenges'
                ? day.challengeActions
                : day.taskActions;

        if (count === 0) return 'bg-[#d8dee8]/60 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]';
        if (count === 1) return 'bg-sky-200 border border-sky-300 shadow-sm';
        if (count <= 3) return 'bg-sky-400 text-white shadow-sm';
        if (count <= 5) return 'bg-[#549acb] text-white shadow-sm';
        return 'bg-[#3b82f6] text-white shadow-sm';
    };

    return (
        <div className="neu-card p-6 rounded-3xl space-y-5 border border-white/60">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-[#1a1c35] flex items-center space-x-2">
                            <span>Unified Activity & Execution Matrix</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full neu-inset text-[#549acb] font-bold">
                                365 Days
                            </span>
                        </h3>
                        <p className="text-xs text-[#717699] font-medium">
                            Full annual contribution history across challenges, roadmap milestones, and daily habits
                        </p>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 neu-inset p-1 rounded-2xl bg-[#E0E5EC]/80">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            activeFilter === 'all'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                    >
                        All Actions
                    </button>
                    <button
                        onClick={() => setActiveFilter('challenges')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            activeFilter === 'challenges'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                    >
                        Challenges
                    </button>
                    <button
                        onClick={() => setActiveFilter('tasks')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            activeFilter === 'tasks'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                    >
                        Tasks
                    </button>
                </div>
            </div>

            {/* Matrix Container - 365 Days GitHub-style */}
            <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin">
                <div className="min-w-[840px] space-y-1.5">
                    {/* Horizontal Months Row aligned with weeks */}
                    <div className="flex pl-8 text-[11px] font-bold text-[#717699] select-none h-4 relative">
                        {monthLabels.map((m, idx) => {
                            // Calculate column offset: each week is ~15px (11px cell + 4px gap)
                            const leftOffset = m.weekIndex * 15;
                            return (
                                <span
                                    key={`month-${idx}`}
                                    className="absolute"
                                    style={{ left: `${leftOffset}px` }}
                                >
                                    {m.name}
                                </span>
                            );
                        })}
                    </div>

                    {/* Days grid with Mon / Wed / Fri row labels */}
                    <div className="flex items-start">
                        {/* Day labels (Mon, Wed, Fri) aligned to 7 rows */}
                        <div className="flex flex-col justify-between pr-2 text-[9px] font-bold text-[#717699] select-none h-[105px] pt-1">
                            <span className="leading-none">Mon</span>
                            <span className="leading-none">Wed</span>
                            <span className="leading-none">Fri</span>
                        </div>

                        {/* 53-54 Weeks columns */}
                        <div className="flex space-x-1">
                            {weeks.map((week, wIndex) => (
                                <div key={`week-${wIndex}`} className="flex flex-col space-y-1">
                                    {week.map((day) => {
                                        const count =
                                            activeFilter === 'all'
                                                ? day.totalActions
                                                : activeFilter === 'challenges'
                                                ? day.challengeActions
                                                : day.taskActions;

                                        return (
                                            <div
                                                key={day.date}
                                                onMouseEnter={() => setHoveredDay(day)}
                                                onMouseLeave={() => setHoveredDay(null)}
                                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm cursor-pointer transition-transform duration-150 hover:scale-125 ${getCellColorClass(
                                                    day
                                                )}`}
                                                title={`${day.displayDate}: ${count} actions`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
