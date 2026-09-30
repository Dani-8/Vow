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
            {/* Top Bar: Title & Segmented Switcher */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#647196]">
                        {activeSession ? 'Focus Active' : 'Current Time'}
                    </span>
                    {activeSession && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                </div>

                <div className="flex items-center space-x-1 neu-inset p-1 rounded-xl bg-[#E0E5EC]/90 border border-white/60">
                    <button
                        onClick={() => handleModeChange('clock')}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${activeMode === 'clock'
                            ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                        title="View Current Time"
                    >
                        <Clock className="w-3.5 h-3.5" />
                        {activeMode === 'clock' && <span>Clock</span>}
                    </button>

                    <button
                        onClick={() => handleModeChange('calendar')}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${activeMode === 'calendar'
                            ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                        title="View Month Calendar"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        {activeMode === 'calendar' && <span>Calendar</span>}
                    </button>

                    {activeSession && (
                        <button
                            onClick={() => handleModeChange('focus')}
                            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${activeMode === 'focus'
                                ? 'neu-button text-emerald-600 bg-[#E0E5EC]'
                                : 'text-emerald-600 hover:text-emerald-700'
                                }`}
                            title="View Active Timer"
                        >
                            <Timer className="w-3.5 h-3.5 animate-spin-slow" />
                            {activeMode === 'focus' && <span>Focus</span>}
                        </button>
                    )}
                </div>
            </div>

            {/* Mode Content */}
            {activeSession && activeMode === 'focus' ? (
                /* LIVE FOCUS SESSION MODE */
                <div className="flex flex-col items-center justify-between text-center py-2 space-y-3">
                    {/* Session Target Name */}
                    <div className="w-full px-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#549acb] block">
                            {activeSession.sourceType === 'task' ? 'Task Focus' : 'Challenge Focus'}
                        </span>
                        <h4 className="text-xs font-black text-[#1a1c35] truncate max-w-full">
                            {activeSession.sourceTitle}
                        </h4>
                    </div>

                    {/* Neumorphic Focus Ring */}
                    <div className="w-40 h-40 rounded-full bg-[#E0E5EC] p-3 flex items-center justify-center shadow-[8px_8px_18px_rgba(163,177,198,0.65),-8px_-8px_18px_rgba(255,255,255,0.85)] border border-white/60 relative my-0.5">
                        <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_7px_7px_14px_rgba(163,177,198,0.65),inset_-7px_-7px_14px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center relative">
                            <span className="text-3xl font-black text-[#29335a] tracking-wider font-mono">
                                {formattedTimer}
                            </span>
                            <span className="text-[10px] font-bold text-[#647196] uppercase tracking-wider mt-1">
                                {activeSession.isRunning ? 'Streaming Live' : 'Paused'}
                            </span>
                        </div>
                    </div>
