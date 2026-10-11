import React, { useState, useMemo } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle2, Timer, Zap, X, Info, Maximize2 } from 'lucide-react';
import { Task } from '../../../../types';
import { useFocusTimer } from '../../../../context/FocusTimerContext';

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
    const { activeSession, togglePlayPause, resetSession, completeSessionEarly, stopSession, openZenMode } = useFocusTimer();

    // Persist choice in localStorage
    const [activeMode, setActiveMode] = useState<'clock' | 'calendar' | 'focus'>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'calendar' || saved === 'focus') return saved;
            return 'clock';
        } catch {
            return 'clock';
        }
    });

    const handleModeChange = (mode: 'clock' | 'calendar' | 'focus') => {
        setActiveMode(mode);
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch (e) {
            console.error('Failed to save clock mode preference', e);
        }
    };