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
