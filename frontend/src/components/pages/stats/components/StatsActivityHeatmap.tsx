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
