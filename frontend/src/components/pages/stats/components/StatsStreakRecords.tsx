import React, { useState, useMemo } from 'react';
import { Target, Flame, Trophy, Search, Lock, Award, Sparkles, Star, Medal } from 'lucide-react';
import { Task, MasterStreakStats } from '../../../../types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { calculateTaskSubTaskProgress } from '../../../../utils/subtaskStorage';

interface StatsStreakRecordsProps {
    tasks: Task[];
    stats: MasterStreakStats | null;
}

export const StatsStreakRecords: React.FC<StatsStreakRecordsProps> = ({ tasks, stats }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'habits' | 'goals' | 'private'>('all');
    const [sortBy, setSortBy] = useState<'currentStreak' | 'bestStreak' | 'subtasks' | 'title'>('currentStreak');

    // 1. Hall of Fame (Top 3 streaks of all time)
    const hallOfFame = useMemo(() => {
        const sorted = [...tasks].sort((a, b) => {
            const bestA = Math.max(a.bestStreak || 0, a.currentStreak || 0);
            const bestB = Math.max(b.bestStreak || 0, b.currentStreak || 0);
            return bestB - bestA;
        });
        return sorted.slice(0, 3);
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        let list = tasks.filter((t) => {
            const matchesSearch =
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (typeFilter === 'habits') return t.isHabit;
            if (typeFilter === 'goals') return !t.isHabit;
            if (typeFilter === 'private') return t.isPrivate;
            return true;
        });

        return list.sort((a, b) => {
            if (sortBy === 'currentStreak') {
                return (b.currentStreak || 0) - (a.currentStreak || 0);
            }
            if (sortBy === 'bestStreak') {
                return (b.bestStreak || 0) - (a.bestStreak || 0);
            }
            if (sortBy === 'subtasks') {
                const progA = calculateTaskSubTaskProgress(a._id, a.subTasks);
                const progB = calculateTaskSubTaskProgress(b._id, b.subTasks);
                return progB.percent - progA.percent;
            }
            return a.title.localeCompare(b.title);
        });
    }, [tasks, searchQuery, typeFilter, sortBy]);

    const masterStreak = stats?.masterStreak || 0;
    const bestMasterStreak = Math.max(masterStreak, stats?.bestMasterStreak || 0);

    return (
        <div className="space-y-6">
            {/* Top Row: Master Resilience Highlight & Hall of Fame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Master Streak Engine Guard */}
                <div className="lg:col-span-4 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2.5">
                            <span className="p-2 rounded-xl neu-inset text-amber-500 bg-[#E0E5EC]">
                                <Flame className="w-5 h-5 fill-amber-500" />
                            </span>
                            <div>
                                <h3 className="text-sm font-black text-[#1a1c35]">Master Streak Integrity</h3>
                                <span className="text-[10px] font-bold text-[#717699] uppercase">Global Non-Punitive Engine</span>
                            </div>
                        </div>

                        <div className="neu-inset p-4 rounded-2xl space-y-2 bg-[#E0E5EC]/80">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-[#717699]">Active Master Streak</span>
                                <span className="text-2xl font-black text-[#1a1c35]">{masterStreak} Days</span>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-slate-300 pt-1.5">
                                <span className="text-xs font-bold text-[#717699]">All-Time Master High</span>
                                <span className="text-sm font-black text-[#549acb]">{bestMasterStreak} Days Record</span>
                            </div>
                        </div>

                        <p className="text-xs text-[#717699] font-medium leading-relaxed">
                            No shame or guilt resets: your current streak tracks your current unbroken cadence, while your best score is permanently preserved.
                        </p>
                    </div>

                    <div className="px-3 py-2 rounded-2xl neu-inset text-xs font-bold text-[#1a1c35] flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#549acb] shrink-0" />
                        <span>Every daily check-in extends your lifetime score.</span>
                    </div>
                </div>

                {/* Hall of Fame: Top 3 Streaks of All Time */}
                <div className="lg:col-span-8 neu-card p-6 rounded-3xl space-y-4 border border-white/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35]">Streak Hall of Fame</h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    Your all-time top 3 longest sustained daily disciplines
                                </p>
                            </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center space-x-1">
                            <Medal className="w-3.5 h-3.5" />
                            <span>Permanent Records</span>
                        </span>
                    </div>