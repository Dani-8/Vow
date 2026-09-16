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
                                        className={`h-full rounded-full transition-all duration-500 ${isNewRecord
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

            {/* Complete Habits & Goals Streak Leaderboard */}
            <div className="neu-card p-6 rounded-3xl space-y-5 border border-white/60">
                {/* Header with Search and Filters */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1a1c35] flex items-center space-x-2">
                                <span>Habits & Goals Streak Leaderboard</span>
                            </h3>
                            <p className="text-xs text-[#717699] font-medium">
                                Ranked performance and permanent records across all daily routines
                            </p>
                        </div>
                    </div>

                    {/* Search Bar & Sorter */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-60">
                            <Search className="w-4 h-4 text-[#717699] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter habits or goals..."
                                className="w-full pl-9 pr-3 py-1.5 rounded-2xl neu-inset text-xs font-semibold text-[#1a1c35] placeholder-[#717699] focus:outline-none bg-[#E0E5EC]/90"
                            />
                        </div>

                        <div className="flex items-center space-x-1 neu-inset p-1 rounded-2xl bg-[#E0E5EC]/80">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent text-xs font-bold text-[#44476A] px-2 py-1 focus:outline-none cursor-pointer"
                            >
                                <option value="currentStreak">Sort: Current Streak</option>
                                <option value="bestStreak">Sort: Best Record</option>
                                <option value="subtasks">Sort: Subtask Progress</option>
                                <option value="title">Sort: Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'all'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        All ({tasks.length})
                    </button>
                    <button
                        onClick={() => setTypeFilter('habits')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'habits'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Daily Habits ({tasks.filter((t) => t.isHabit).length})
                    </button>
                    <button
                        onClick={() => setTypeFilter('goals')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'goals'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Single Goals ({tasks.filter((t) => !t.isHabit).length})
                    </button>
                    <button
                        onClick={() => setTypeFilter('private')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'private'
                                ? 'neu-button text-purple-600 bg-[#E0E5EC]'
                                : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Growth Vault ({tasks.filter((t) => t.isPrivate).length})
                    </button>
                </div>

                {/* List */}
                {filteredTasks.length === 0 ? (
                    <div className="neu-inset p-8 rounded-2xl text-center space-y-3 border border-dashed border-slate-300">
                        <div className="w-10 h-10 mx-auto rounded-2xl neu-button flex items-center justify-center text-[#717699] bg-[#E0E5EC]">
                            <Search className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-[#1a1c35]">
                                {tasks.length === 0 ? 'No tasks or habits created yet' : 'No items match your active filters'}
                            </p>
                            <p className="text-[11px] text-[#717699]">
                                {tasks.length === 0
                                    ? 'Add a new habit or task in the main dashboard to begin accumulating streaks.'
                                    : 'Try searching for a different keyword or resetting your filter category.'}
                            </p>
                        </div>
                        {tasks.length > 0 && (searchQuery || typeFilter !== 'all') && (
                            <button
                                onClick={resetFilters}
                                className="px-3.5 py-1.5 rounded-xl neu-button text-xs font-black text-[#549acb] bg-[#E0E5EC] inline-flex items-center space-x-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset Filters</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredTasks.map((task, index) => {
                            const Icon = getCategoryIconComponent(task.icon || task.category);
                            const subProgress = calculateTaskSubTaskProgress(task._id, task.subTasks);
                            const curStreak = task.currentStreak || 0;
                            const bestStreak = task.bestStreak || 0;
                            const isRecordMatched = curStreak >= bestStreak && curStreak > 0;
                            const isDoneToday = Boolean(task.completedToday || task.status === 'completed');

                            return (
                                <div
                                    key={task._id}
                                    className="neu-inset p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/40 bg-[#E0E5EC]/90 hover:bg-[#E0E5EC] transition-all"
                                >
                                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                                        <span className="w-6 text-center text-xs font-black text-[#717699] shrink-0">
                                            #{index + 1}
                                        </span>

                                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-extrabold text-sm text-[#1a1c35] truncate">
                                                    {task.title}
                                                </h4>
                                                {task.isPrivate && (
                                                    <span className="p-0.5 rounded-full text-purple-600 shrink-0" title="Private Vault Item">
                                                        <Lock className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                                <span className="text-[11px] font-bold text-[#717699]">
                                                    {task.isHabit ? 'Daily Habit' : 'Single Goal'}
                                                </span>
                                                {task.category && (
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full neu-inset text-[#44476A]">
                                                        {task.category}
                                                    </span>
                                                )}
                                                {subProgress.total > 0 && (
                                                    <span className="text-[10px] font-bold text-[#549acb] flex items-center space-x-1">
                                                        <span>{subProgress.completed}/{subProgress.total} Subtasks ({subProgress.percent}%)</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 shrink-0 pl-9 sm:pl-0">
                                        {/* Live daily badge */}
                                        <div className="flex items-center space-x-1.5">
                                            {isDoneToday ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 flex items-center space-x-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    <span>Done Today</span>
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-[#717699] bg-slate-300/40 border border-slate-300 flex items-center space-x-1">
                                                    <Clock className="w-3 h-3 text-[#717699]" />
                                                    <span>Pending</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-left sm:text-right space-y-0.5 min-w-[100px]">
                                            <div className="flex items-center sm:justify-end space-x-1.5">
                                                <span className={`text-sm font-black flex items-center space-x-1 ${curStreak > 0 ? 'text-amber-500' : 'text-[#717699]'
                                                    }`}>
                                                    <Flame className={`w-4 h-4 ${curStreak > 0 ? 'fill-amber-500' : ''}`} />
                                                    <span>{curStreak}d Streak</span>
                                                </span>
                                                {isRecordMatched && (
                                                    <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-600 text-[9px] font-black uppercase">
                                                        Record!
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-bold text-[#549acb] flex items-center sm:justify-end space-x-1">
                                                <Trophy className="w-3 h-3" />
                                                <span>Best: {bestStreak} Days</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
