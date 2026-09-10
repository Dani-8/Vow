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