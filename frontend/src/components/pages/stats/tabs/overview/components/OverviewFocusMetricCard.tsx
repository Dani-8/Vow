import React, { useMemo } from 'react';
import { Timer, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { getCompletedFocusSessions } from '../../../../../../context/FocusTimerContext';
import { Challenge } from '../../../../../../types';

interface OverviewFocusMetricCardProps {
    challenges?: Challenge[];
}

export const OverviewFocusMetricCard: React.FC<OverviewFocusMetricCardProps> = ({ challenges = [] }) => {
    // 1. Gather all logged sessions from timer context storage
    const timerSessions = useMemo(() => getCompletedFocusSessions(), []);

    // 2. Also parse challenge sprint logs that recorded timeSpent (e.g. "1h 30m" or "45m")
    const challengeLoggedMinutes = useMemo(() => {
        let total = 0;
        challenges.forEach((ch) => {
            (ch.logs || []).forEach((log) => {
                if (log.timeSpent && log.status === 'completed') {
                    // parse "1h 30m", "45m", "2h"
                    let mins = 0;
                    const hMatch = log.timeSpent.match(/(\d+)\s*h/i);
                    const mMatch = log.timeSpent.match(/(\d+)\s*m/i);
                    if (hMatch) mins += parseInt(hMatch[1], 10) * 60;
                    if (mMatch) mins += parseInt(mMatch[1], 10);
                    total += mins;
                }
            });
        });
        return total;
    }, [challenges]);

    // Timer sessions logged minutes
    const timerLoggedMinutes = useMemo(() => {
        return timerSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    }, [timerSessions]);

    const totalMinutes = timerLoggedMinutes + challengeLoggedMinutes;
    const totalHours = (totalMinutes / 60).toFixed(1);
    const totalSessions = timerSessions.length;

    // Recent 5 completed sessions
    const recentSessions = useMemo(() => {
        return [...timerSessions]
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            .slice(0, 4);
    }, [timerSessions]);

    return (
        <div className="neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-xl space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 neu-button flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                        <Timer className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-base font-black text-[#1a1c35]">Deep Focus Insights</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Live Tracking
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-[#717699]">
                            Laser focus sessions across your tasks and daily challenge sprints
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#515777] bg-white/60 px-3 py-1.5 rounded-xl border border-white/80 neu-inset">
                        ⚡ {totalSessions} completed session{totalSessions === 1 ? '' : 's'}
                    </span>
                </div>
            </div>

            {/* Metric Strips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="neu-inset p-3.5 rounded-2xl bg-[#E0E5EC]/80 border border-white/40 text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#717699] block">
                        Total Focus Time
                    </span>
                    <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
                        {totalHours}h
                    </span>
                    <span className="text-[10px] font-semibold text-[#717699] block">
                        {totalMinutes} minutes logged
                    </span>
                </div>

                <div className="neu-inset p-3.5 rounded-2xl bg-[#E0E5EC]/80 border border-white/40 text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#717699] block">
                        Sessions Finished
                    </span>
                    <span className="text-2xl font-black text-[#1a1c35] mt-0.5 block">
                        {totalSessions}
                    </span>
                    <span className="text-[10px] font-semibold text-[#717699] block">
                        100% intentional
                    </span>
                </div>

                <div className="neu-inset p-3.5 rounded-2xl bg-[#E0E5EC]/80 border border-white/40 text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#717699] block">
                        Avg Session Length
                    </span>
                    <span className="text-2xl font-black text-[#549acb] mt-0.5 block">
                        {totalSessions > 0 ? Math.round(timerLoggedMinutes / totalSessions) : 25}m
                    </span>
                    <span className="text-[10px] font-semibold text-[#717699] block">
                        Per focus block
                    </span>
                </div>

                <div className="neu-inset p-3.5 rounded-2xl bg-[#E0E5EC]/80 border border-white/40 text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#717699] block">
                        Discipline Score
                    </span>
                    <span className="text-2xl font-black text-purple-600 mt-0.5 block">
                        {Math.min(99, 70 + Math.min(29, totalSessions * 5))}%
                    </span>
                    <span className="text-[10px] font-semibold text-[#717699] block">
                        Flow momentum
                    </span>
                </div>
            </div>

            {/* Recent Focus Activity List */}
            {recentSessions.length > 0 ? (
                <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-[#515777] block">
                        Recent Focus Log History
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {recentSessions.map((s) => (
                            <div
                                key={s.id}
                                className="neu-inset p-3 rounded-2xl flex items-center justify-between bg-white/40 border border-white/60"
                            >
                                <div className="min-w-0 pr-2">
                                    <div className="flex items-center space-x-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span className="text-xs font-black text-[#1a1c35] truncate block">
                                            {s.sourceTitle}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-[#717699] block mt-0.5">
                                        {s.sourceType === 'task' ? 'Task' : 'Challenge Sprint'} •{' '}
                                        {new Date(s.completedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <span className="neu-button px-2.5 py-1 rounded-xl text-xs font-black text-emerald-700 bg-emerald-50/80 shrink-0">
                                    +{s.durationMinutes}m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="neu-inset p-4 rounded-2xl text-center bg-white/30 border border-white/50 space-y-1">
                    <p className="text-xs font-bold text-[#1a1c35]">
                        Ready to clock your first focus block?
                    </p>
                    <p className="text-[11px] font-semibold text-[#717699]">
                        Start a timer on any Task or Challenge. When completed, your stats and flow rate appear here automatically.
                    </p>
                </div>
            )}
        </div>
    );
};
