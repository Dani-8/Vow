import React from 'react';
import { Target, Search, RotateCcw } from 'lucide-react';
import { Task } from '../../../../../../types';
import { StreakLeaderboardItem } from './StreakLeaderboardItem';

interface StreakLeaderboardProps {
    totalTasksCount: number;
    habitsCount: number;
    goalsCount: number;
    vaultCount: number;
    filteredTasks: Task[];
    searchQuery: string;
    typeFilter: 'all' | 'habits' | 'goals' | 'private';
    sortBy: 'currentStreak' | 'bestStreak' | 'subtasks' | 'title';
    onSearchChange: (q: string) => void;
    onTypeFilterChange: (t: 'all' | 'habits' | 'goals' | 'private') => void;
    onSortChange: (s: 'currentStreak' | 'bestStreak' | 'subtasks' | 'title') => void;
    onResetFilters: () => void;
}

export const StreakLeaderboard: React.FC<StreakLeaderboardProps> = ({
    totalTasksCount,
    habitsCount,
    goalsCount,
    vaultCount,
    filteredTasks,
    searchQuery,
    typeFilter,
    sortBy,
    onSearchChange,
    onTypeFilterChange,
    onSortChange,
    onResetFilters,
}) => {
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
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Filter habits or goals..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-2xl neu-inset text-xs font-semibold text-[#1a1c35] placeholder-[#717699] focus:outline-none bg-[#E0E5EC]/90"
                        />
                    </div>

                    <div className="flex items-center space-x-1 neu-inset p-1 rounded-2xl bg-[#E0E5EC]/80">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as any)}
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
                    onClick={() => onTypeFilterChange('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'all'
                        ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                        : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    All ({totalTasksCount})
                </button>
                <button
                    onClick={() => onTypeFilterChange('habits')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'habits'
                        ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                        : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    Daily Habits ({habitsCount})
                </button>
                <button
                    onClick={() => onTypeFilterChange('goals')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'goals'
                        ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                        : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    Single Goals ({goalsCount})
                </button>
                <button
                    onClick={() => onTypeFilterChange('private')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${typeFilter === 'private'
                        ? 'neu-button text-purple-600 bg-[#E0E5EC]'
                        : 'neu-inset text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    Growth Vault ({vaultCount})
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
                            {totalTasksCount === 0 ? 'No tasks or habits created yet' : 'No items match your active filters'}
                        </p>
                        <p className="text-[11px] text-[#717699]">
                            {totalTasksCount === 0
                                ? 'Add a new habit or task in the main dashboard to begin accumulating streaks.'
                                : 'Try searching for a different keyword or resetting your filter category.'}
                        </p>
                    </div>
                    {totalTasksCount > 0 && (searchQuery || typeFilter !== 'all') && (
                        <button
                            onClick={onResetFilters}
                            className="px-3.5 py-1.5 rounded    -xl neu-button text-xs font-black text-[#549acb] bg-[#E0E5EC] inline-flex items-center space-x-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filters</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map((task, index) => (
                        <StreakLeaderboardItem
                            key={task._id}
                            task={task}
                            rank={index + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
