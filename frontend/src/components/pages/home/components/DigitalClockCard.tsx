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

    // Calendar Grid Days Calculation (Monday - Sunday standard)
    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Day of week index where Monday is 0 and Sunday is 6
        let startDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (startDayOfWeek === -1) startDayOfWeek = 6;

        const days = [];

        // Previous month padding
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

        // Current month days
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

        // Next month padding to fill a complete 35 or 42 grid
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

    return (
        <div className="lg:col-span-4 neu-card p-5 flex flex-col justify-between">
            {/* Top Bar: Segmented Switcher */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#647196]">
                    {activeMode === 'clock' ? 'Live Clock' : 'Month Glance'}
                </span>

                <div className="flex items-center space-x-1 neu-inset p-1 rounded-xl bg-[#E0E5EC]/90 border border-white/60">
                    <button
                        onClick={() => setActiveMode('clock')}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                            activeMode === 'clock'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                        title="View Current Time"
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Clock</span>
                    </button>

                    <button
                        onClick={() => setActiveMode('calendar')}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                            activeMode === 'calendar'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                        title="View Month Calendar"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Calendar</span>
                    </button>
                </div>
            </div>

            {/* Mode Content */}
            {activeMode === 'clock' ? (
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
                </div>
            ) : (
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