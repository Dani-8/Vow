import React, { useState, useMemo } from 'react';
import { Target, Flame, Trophy, Search, Lock, Award, Sparkles, Star, Medal, Crown, CheckCircle2, Clock, RotateCcw, TrendingUp } from 'lucide-react';
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

    const recordProgress = bestMasterStreak > 0
        ? Math.min(100, Math.round((masterStreak / bestMasterStreak) * 100))
        : (masterStreak > 0 ? 100 : 0);
    const daysToRecord = Math.max(0, bestMasterStreak - masterStreak);
    const isNewRecord = masterStreak >= bestMasterStreak && masterStreak > 0;

    // Podium rankings styling with bespoke icons & colors (no emojis)
    const rankConfigs = [
        {
            title: 'Rank 1 • Champion',
            icon: Crown,
            iconColor: 'text-amber-500',
            badgeBg: 'bg-amber-500/15 text-amber-600 border border-amber-400/50',
            ringColor: 'border-amber-400',
        },
        {
            title: 'Rank 2 • Contender',
            icon: Medal,
            iconColor: 'text-slate-400',
            badgeBg: 'bg-slate-400/15 text-slate-600 border border-slate-400/50',
            ringColor: 'border-slate-400',
        },
        {
            title: 'Rank 3 • Vanguard',
            icon: Award,
            iconColor: 'text-[#c27803]',
            badgeBg: 'bg-amber-700/15 text-[#c27803] border border-amber-600/40',
            ringColor: 'border-amber-600/70',
        },
    ];

    const resetFilters = () => {
        setSearchQuery('');
        setTypeFilter('all');
    };

    return (
        <div className="space-y-6">
            {/* Top Row: Master Resilience Highlight & Hall of Fame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Master Streak Engine Guard: Sleek & Compact */}
                <div className="lg:col-span-4 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                    <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                                <span className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                                    <Flame className="w-5 h-5 fill-amber-500" />
                                </span>
                                <div>
                                    <h3 className="text-sm font-black text-[#1a1c35]">Master Streak</h3>
                                    <span className="text-[10px] font-bold text-[#717699] uppercase tracking-wider">Global Integrity</span>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-amber-600">
                                {recordProgress}% Record Pace
                            </span>
                        </div>

                        <div className="neu-inset p-4 rounded-2xl space-y-2.5 bg-[#E0E5EC]/80">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-[#717699]">Active Master Streak</span>
                                <span className="text-2xl font-black text-[#1a1c35] tracking-tight">{masterStreak} Days</span>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-slate-300 pt-2">
                                <span className="text-xs font-bold text-[#717699]">All-Time High Mark</span>
                                <span className="text-sm font-black text-[#549acb]">{bestMasterStreak} Days Record</span>
                            </div>

                            {/* Progress bar toward beating record */}
                            <div className="pt-1 space-y-1">
                                <div className="w-full h-2 rounded-full neu-inset overflow-hidden p-0.5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isNewRecord
                                                ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                                                : 'bg-gradient-to-r from-amber-400 to-[#549acb]'
                                        }`}
                                        style={{ width: `${Math.max(6, Math.min(100, recordProgress))}%` }}
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-[#717699]">
                                    {isNewRecord
                                        ? '⚡ All-time peak active! Every day sets a new benchmark.'
                                        : `${daysToRecord} more active day${daysToRecord === 1 ? '' : 's'} to surpass personal best.`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-3 py-2 rounded-2xl neu-inset text-xs font-bold text-[#44476A] flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#549acb] shrink-0" />
                        <span className="text-[11px] leading-tight">Non-punitive resilience engine preserves lifetime momentum.</span>
                    </div>
                </div>

                {/* Hall of Fame: Top 3 Streaks with bespoke icons & colors */}
                <div className="lg:col-span-8 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[#1a1c35]">Streak Hall of Fame</h3>
                                    <p className="text-xs text-[#717699] font-medium">
                                        All-time top 3 sustained daily disciplines & habits
                                    </p>
                                </div>
                            </div>

                            <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center space-x-1">
                                <Medal className="w-3.5 h-3.5" />
                                <span>Permanent Vault</span>
                            </span>
                        </div>

                        {hallOfFame.length === 0 ? (
                            <div className="neu-inset p-8 rounded-2xl text-center space-y-2 border border-dashed border-slate-300">
                                <div className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <h4 className="text-xs font-black text-[#1a1c35]">No Streak Records Established</h4>
                                <p className="text-[11px] font-medium text-[#717699] max-w-sm mx-auto">
                                    Complete tasks and daily habits consistently to earn your place on the all-time podium.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                {hallOfFame.map((item, idx) => {
                                    const Icon = getCategoryIconComponent(item.icon || item.category);
                                    const best = Math.max(item.bestStreak || 0, item.currentStreak || 0);
                                    const cur = item.currentStreak || 0;
                                    const isDoneToday = Boolean(item.completedToday || item.status === 'completed');
                                    const rank = rankConfigs[idx] || rankConfigs[2];
                                    const RankIcon = rank.icon;

                                    return (
                                        <div
                                            key={item._id}
                                            className={`neu-inset p-4 rounded-2xl space-y-3 border ${rank.ringColor} bg-[#E0E5EC]/80 flex flex-col justify-between group hover:scale-[1.01] transition-all`}
                                        >
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 ${rank.badgeBg}`}>
                                                        <RankIcon className={`w-3 h-3 ${rank.iconColor}`} />
                                                        <span>{rank.title}</span>
                                                    </span>

                                                    <div className="w-7 h-7 rounded-lg neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>

                                                <h4 className="text-xs font-black text-[#1a1c35] line-clamp-2 leading-snug">
                                                    {item.title}
                                                </h4>

                                                {/* Live daily scoreboard indicator */}
                                                <div className="flex items-center space-x-1.5">
                                                    {isDoneToday ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 flex items-center space-x-1">
                                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                                            <span>Done Today</span>
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-amber-700 bg-amber-500/15 border border-amber-500/30 flex items-center space-x-1">
                                                            <Flame className="w-2.5 h-2.5 text-amber-500" />
                                                            <span>Pending Today</span>
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-bold text-[#717699]">
                                                        {cur}d active
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-300/80 flex items-baseline justify-between">
                                                <span className="text-[10px] font-bold text-[#717699]">All-Time Peak</span>
                                                <span className={`text-base font-black ${rank.iconColor}`}>{best} Days</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
