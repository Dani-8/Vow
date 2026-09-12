import React, { useState, useMemo } from 'react';
import { Target, Flame, Trophy, Search, CheckCircle2, Lock, ListFilter, ArrowUpDown } from 'lucide-react';
import { Task } from '../../../../types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { calculateTaskSubTaskProgress } from '../../../../utils/subtaskStorage';

interface StatsLeaderboardProps {
    tasks: Task[];
}

export const StatsLeaderboard: React.FC<StatsLeaderboardProps> = ({ tasks }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'habits' | 'goals' | 'private'>('all');
    const [sortBy, setSortBy] = useState<'currentStreak' | 'bestStreak' | 'subtasks' | 'title'>('currentStreak');

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

    return (
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
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        typeFilter === 'all'
                            ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                            : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                    }`}
                >
                    All ({tasks.length})
                </button>
                <button
                    onClick={() => setTypeFilter('habits')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        typeFilter === 'habits'
                            ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                            : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                    }`}
                >
                    Daily Habits ({tasks.filter((t) => t.isHabit).length})
                </button>
                <button
                    onClick={() => setTypeFilter('goals')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        typeFilter === 'goals'
                            ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                            : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                    }`}
                >
                    Single Goals ({tasks.filter((t) => !t.isHabit).length})
                </button>
                <button
                    onClick={() => setTypeFilter('private')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        typeFilter === 'private'
                            ? 'neu-button text-purple-600 bg-[#E0E5EC]'
                            : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                    }`}
                >
                    Growth Vault ({tasks.filter((t) => t.isPrivate).length})
                </button>
            </div>

            {/* List */}
            {filteredTasks.length === 0 ? (
                <div className="neu-inset p-8 rounded-2xl text-center space-y-1">
                    <p className="text-xs font-bold text-[#717699]">No items matched the current filter.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map((task, index) => {
                        const Icon = getCategoryIconComponent(task.icon || task.category);
                        const subProgress = calculateTaskSubTaskProgress(task._id, task.subTasks);
                        const curStreak = task.currentStreak || 0;
                        const bestStreak = task.bestStreak || 0;
                        const isRecordMatched = curStreak >= bestStreak && curStreak > 0;

                        return (
                            <div
                                key={task._id}
                                className="neu-inset p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/40 bg-[#E0E5EC]/90 hover:bg-[#E0E5EC] transition-all"
                            >
                                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                                    {/* Rank badge */}
                                    <span className="w-6 text-center text-xs font-black text-[#717699] shrink-0">
                                        #{index + 1}
                                    </span>

                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
