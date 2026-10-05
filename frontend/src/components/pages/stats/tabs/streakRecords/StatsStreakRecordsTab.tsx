import React, { useState } from 'react';
import { Task, MasterStreakStats } from '../../../../../types';
import { useStreakRecordsData } from './hooks/useStreakRecordsData';
import { MasterStreakCard } from './components/MasterStreakCard';
import { StreakHallOfFame } from './components/StreakHallOfFame';
import { StreakLeaderboard } from './components/StreakLeaderboard';

interface StatsStreakRecordsTabProps {
    tasks: Task[];
    stats: MasterStreakStats | null;
}

export const StatsStreakRecordsTab: React.FC<StatsStreakRecordsTabProps> = ({ tasks, stats }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'habits' | 'goals' | 'private'>('all');
    const [sortBy, setSortBy] = useState<'currentStreak' | 'bestStreak' | 'subtasks' | 'title'>('currentStreak');

    const {
        hallOfFame,
        filteredTasks,
        masterStreak,
        bestMasterStreak,
        recordProgress,
        daysToRecord,
        isNewRecord,
    } = useStreakRecordsData({
        tasks,
        stats,
        searchQuery,
        typeFilter,
        sortBy,
    });

    const resetFilters = () => {
        setSearchQuery('');
        setTypeFilter('all');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Top Row: Master Resilience Highlight & Hall of Fame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <MasterStreakCard
                    masterStreak={masterStreak}
                    bestMasterStreak={bestMasterStreak}
                    recordProgress={recordProgress}
                    daysToRecord={daysToRecord}
                    isNewRecord={isNewRecord}
                />
                <StreakHallOfFame hallOfFame={hallOfFame} />
            </div>
