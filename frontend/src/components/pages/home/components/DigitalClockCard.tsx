import React, { useState, useMemo } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle2, Timer, Zap, X, Info } from 'lucide-react';
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

    // Map tasks to dates for quick dot lookup
    const datesWithTasks = useMemo(() => {
        const set = new Set<string>();
        tasks.forEach((t) => {
            const dateStr = t.endTime || t.startTime || t.createdAt;
            if (dateStr) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
                }
            }
        });
        return set;
    }, [tasks]);

    // Calendar Grid Days Calculation
    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let startDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (startDayOfWeek === -1) startDayOfWeek = 6;

        const days = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            days.push({
                dayNum,
                isCurrentMonth: false,
                isToday: false,
                hasTask: false,
                key: `prev-${dayNum}`,
            });
        }

        const totalDays = lastDayOfMonth.getDate();
        for (let d = 1; d <= totalDays; d++) {
            const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === d;
            const hasTask = datesWithTasks.has(`${year}-${month}-${d}`);
            days.push({
                dayNum: d,
                isCurrentMonth: true,
                isToday,
                hasTask,
                key: `cur-${d}`,
            });
        }

        const remainingSlots = (7 - (days.length % 7)) % 7;
        for (let i = 1; i <= remainingSlots; i++) {
            days.push({
                dayNum: i,
                isCurrentMonth: false,
                isToday: false,
                hasTask: false,
                key: `next-${i}`,
            });
        }

        return days;
    }, [viewDate, today, datesWithTasks]);

    // Timer formatted values
    const timerMinutes = activeSession ? Math.floor(activeSession.remainingSeconds / 60) : 0;
    const timerSeconds = activeSession ? activeSession.remainingSeconds % 60 : 0;
    const formattedTimer = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

    // Timer Progress
    const timerProgress = activeSession && activeSession.totalSeconds > 0
        ? ((activeSession.totalSeconds - activeSession.remainingSeconds) / activeSession.totalSeconds) * 100
        : 0;

    return (
        <div className="lg:col-span-4 neu-card p-5 flex flex-col justify-between">
            {/* Top Bar: Title & 3 Persistent Segmented Switcher Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#647196]">
                        {activeMode === 'focus'
                            ? activeSession
                                ? 'Focus Active'
                                : 'Focus Timer'
                            : 'Current Time'}
                    </span>
                    {activeSession && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                </div>