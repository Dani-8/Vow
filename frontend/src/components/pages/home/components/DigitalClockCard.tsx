import React, { useState, useMemo } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle2, Timer, Zap, X } from 'lucide-react';
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
    const { activeSession, togglePlayPause, resetSession, completeSessionEarly, stopSession } = useFocusTimer();

    // Persist choice in localStorage
    const [activeMode, setActiveMode] = useState<'clock' | 'calendar' | 'focus'>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved === 'calendar' ? 'calendar' : 'clock';
        } catch {
            return 'clock';
        }
    });

    // If a session is actively running and user hasn't explicitly clicked away, give option to switch to focus
    const handleModeChange = (mode: 'clock' | 'calendar' | 'focus') => {
        setActiveMode(mode);
        try {
            if (mode !== 'focus') {
                localStorage.setItem(STORAGE_KEY, mode);
            }
        } catch (e) {
            console.error('Failed to save clock mode preference', e);
        }
    };

    const [viewDate, setViewDate] = useState<Date>(() => new Date());
    const today = useMemo(() => new Date(), []);