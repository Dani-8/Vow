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

                    {/* Live Progress Pill */}
                    <div className="w-full px-4">
                        <div className="w-full h-1.5 rounded-full neu-inset overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.max(0, timerProgress))}%` }}
                            />
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-center space-x-2 pt-1">
                        <button
                            onClick={togglePlayPause}
                            className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${activeSession.isRunning
                                ? 'neu-button text-amber-600 bg-[#E0E5EC]'
                                : 'neu-button-primary text-white'
                                }`}
                            title={activeSession.isRunning ? 'Pause Timer' : 'Resume Timer'}
                        >
                            {activeSession.isRunning ? (
                                <Pause className="w-4 h-4 fill-current" />
                            ) : (
                                <Play className="w-4 h-4 fill-current" />
                            )}
                            <span>{activeSession.isRunning ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button
                            onClick={resetSession}
                            className="p-2.5 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] transition-all"
                            title="Reset Timer"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                            onClick={completeSessionEarly}
                            className="p-2.5 rounded-xl neu-button text-emerald-600 hover:text-emerald-700 transition-all"
                            title="Complete & Log Now"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={stopSession}
                            className="p-2.5 rounded-xl neu-button text-rose-500 hover:text-rose-600 transition-all"
                            title="Cancel Session"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : activeMode === 'clock' ? (
                /* REGULAR CLOCK MODE */
                <div className="flex flex-col items-center justify-center text-center py-2">
                    {/* Perfect Neumorphic Double-Ring Circular Clock Face */}
                    <div className="w-44 h-44 rounded-full bg-[#E0E5EC] p-3.5 flex items-center justify-center shadow-[8px_8px_18px_rgba(163,177,198,0.65),-8px_-8px_18px_rgba(255,255,255,0.85)] border border-white/60 relative my-1">
                        <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_7px_7px_14px_rgba(163,177,198,0.65),inset_-7px_-7px_14px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center">
                            <span className="text-3xl sm:text-4xl font-black text-[#29335a] tracking-wider font-mono">
                                {formattedHoursMinutes}
                            </span>
                        </div>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm font-bold text-[#29335a]">{formattedDate}</p>
                        <p className="text-xs font-semibold text-[#647196]">{formattedDayName}</p>
                    </div>

                    {/* Small notice if a session is currently running in background */}
                    {activeSession && (
                        <button
                            onClick={() => setActiveMode('focus')}
                            className="mt-2 text-[10px] font-extrabold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-full neu-inset flex items-center space-x-1"
                        >
                            <Zap className="w-3 h-3 text-emerald-500" />
                            <span>Timer active: {formattedTimer} (Click to view)</span>
                        </button>
                    )}
                </div>
            ) : (
                /* CALENDAR MODE */
                <div className="flex flex-col justify-between py-1 space-y-2">
                    {/* Calendar Month Header & Nav */}
                    <div className="flex items-center justify-between px-1">
                        <button
                            onClick={handleResetToCurrentMonth}
                            className="text-xs font-black text-[#1a1c35] hover:text-[#549acb] transition-colors"
                            title="Jump to current month"
                        >
                            {monthName} <span className="text-[#717699] font-bold">{yearNum}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handlePrevMonth}
                                className="w-6 h-6 rounded-lg neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                                title="Previous Month"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="w-6 h-6 rounded-lg neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                                title="Next Month"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Day of Week Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
                            <span
                                key={d}
                                className={`text-[10px] font-black uppercase ${
                                    i >= 5 ? 'text-[#549acb]' : 'text-[#717699]'
                                }`}
                            >
                                {d}
                            </span>
                        ))}
                    </div>