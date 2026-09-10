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