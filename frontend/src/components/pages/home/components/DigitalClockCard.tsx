import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../../../../types';

interface DigitalClockCardProps {
    formattedHoursMinutes: string;
    formattedDate: string;
    formattedDayName: string;
    tasks?: Task[];
}

const STORAGE_KEY = 'home_clock_card_mode';

export const DigitalClockCard: React.FC<DigitalClockCardProps> = ({
    formattedHoursMinutes,
    formattedDate,
    formattedDayName,
    tasks = [],
}) => {
    // Persist choice in localStorage
    const [activeMode, setActiveMode] = useState<'clock' | 'calendar'>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved === 'calendar' ? 'calendar' : 'clock';
        } catch {
            return 'clock';
        }
    });

    const handleModeChange = (mode: 'clock' | 'calendar') => {
        setActiveMode(mode);
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch (e) {
            console.error('Failed to save clock mode preference', e);
        }
    };