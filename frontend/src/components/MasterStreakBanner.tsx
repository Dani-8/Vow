import React from 'react';
import { Flame, Trophy, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { MasterStreakStats } from '../types';

interface MasterStreakBannerProps {
    stats: MasterStreakStats | null;
    onCheckInToday?: () => void;
}

export const MasterStreakBanner: React.FC<MasterStreakBannerProps> = ({ stats, onCheckInToday }) => {
    if (!stats) return null;

    // Build last 14 days calendar matrix
    const days: { dateStr: string; label: string; isCompleted: boolean; isToday: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedSet = new Set(stats.completedDaysSet || []);

    for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const isToday = i === 0;
        const isCompleted = completedSet.has(dateStr);
        const label = d.toLocaleDateString('en-US', { weekday: 'narrow' });

        days.push({ dateStr, label, isCompleted, isToday });
    }

    return (
        <div className="neu-card p-6 mb-8 relative overflow-hidden border-l-4 border-[#549acb]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Main Master Streak Info */}
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-lg shrink-0">
                        <Flame className="w-9 h-9 text-sky-100 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#549acb] bg-sky-100/60 px-2.5 py-0.5 rounded-full border border-sky-200/50">
                                Non-Punitive Streak Engine
                            </span>
                            {stats.activeToday ? (
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Checked In Today!</span>
                                </span>
                            ) : (
                                onCheckInToday && (
                                    <button
                                        onClick={onCheckInToday}
                                        className="text-xs font-extrabold text-white bg-[#549acb] hover:bg-[#4383af] px-3 py-1 rounded-full shadow-md flex items-center space-x-1 transition-transform hover:scale-105"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Check In Today</span>
                                    </button>
                                )
                            )}
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#1a1c35] mt-1">
                            Master Streak: <span className="text-[#549acb]">{stats.masterStreak} Days</span>
                        </h2>
                        <p className="text-xs text-[#717699] max-w-xl mt-1 leading-relaxed font-medium">
                            {stats.activeToday
                                ? `You've checked in today! Keep your record going strong.`
                                : stats.masterStreak > 0
                                    ? `Click today's box in the matrix or complete any goal to maintain your ${stats.masterStreak}-day master streak!`
                                    : `Click today's box in the matrix below to log your daily check-in and start your streak!`
                            }
                        </p>
                    </div>
                </div>

                {/* Heatmap & Check-in Matrix */}
                <div className="w-full md:w-auto neu-inset p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#717699] flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-[#549acb]" />
                            <span>14-Day Matrix (Click Today's Box)</span>
                        </span>
                        <span className="text-xs font-bold text-[#44476A]">{stats.totalCheckIns} Total Days</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {days.map((dayItem, idx) => {
                            const canClickToday = dayItem.isToday && !dayItem.isCompleted && onCheckInToday;

                            return (
                                <div key={idx} className="flex flex-col items-center space-y-1">
                                    <button
                                        type="button"
                                        disabled={!canClickToday}
                                        onClick={() => {
                                            if (canClickToday) {
                                                onCheckInToday();
                                            }
                                        }}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${dayItem.isCompleted
                                                ? 'bg-[#549acb] text-white font-bold shadow-sm'
                                                : dayItem.isToday
                                                    ? 'neu-inset border-2 border-dashed border-[#549acb] text-[#549acb] font-bold animate-pulse cursor-pointer hover:bg-sky-100/50 hover:scale-110 shadow-md ring-2 ring-[#549acb]/30'
                                                    : 'neu-inset text-[#717699] cursor-default'
                                            }`}
                                        title={
                                            dayItem.isCompleted
                                                ? `${dayItem.dateStr}: Completed Check-in`
                                                : dayItem.isToday
                                                    ? `Today (${dayItem.dateStr}): Click to log today's check-in!`
                                                    : `${dayItem.dateStr}: No check-in`
                                        }
                                    >
                                        {dayItem.isCompleted ? '✓' : dayItem.isToday ? '★' : ''}
                                    </button>
                                    <span className="text-[10px] font-semibold text-[#717699]">{dayItem.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
