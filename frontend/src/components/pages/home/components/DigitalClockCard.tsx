import React, { useState, useMemo } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../../../../types';

interface DigitalClockCardProps {
    formattedHoursMinutes: string;
    formattedDate: string;
    formattedDayName: string;
    tasks?: Task[];
}

export const DigitalClockCard: React.FC<DigitalClockCardProps> = ({
    formattedHoursMinutes,
    formattedDate,
    formattedDayName,
    tasks = [],
}) => {
    const [activeMode, setActiveMode] = useState<'clock' | 'calendar'>('clock');
    const [viewDate, setViewDate] = useState<Date>(() => new Date());

    const today = useMemo(() => new Date(), []);

    // Month Navigation
    const handlePrevMonth = () => {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleResetToCurrentMonth = () => {
        setViewDate(new Date());
    };

    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const yearNum = viewDate.getFullYear();
