import { useMemo } from 'react';
import { Task, MasterStreakStats } from '../../../../../../types';
import { calculateTaskSubTaskProgress } from '../../../../../../utils/subtaskStorage';

interface UseStreakRecordsDataParams {
    tasks: Task[];
    stats: MasterStreakStats | null;
    searchQuery: string;
    typeFilter: 'all' | 'habits' | 'goals' | 'private';
    sortBy: 'currentStreak' | 'bestStreak' | 'subtasks' | 'title';
}

export function useStreakRecordsData({
    tasks,
    stats,
    searchQuery,
    typeFilter,
    sortBy,
}: UseStreakRecordsDataParams) {
    // 1. Hall of Fame (Top 3 streaks of all time)
    const hallOfFame = useMemo(() => {
        const sorted = [...tasks].sort((a, b) => {
            const bestA = Math.max(a.bestStreak || 0, a.currentStreak || 0);
            const bestB = Math.max(b.bestStreak || 0, b.currentStreak || 0);
            return bestB - bestA;
        });
        return sorted.slice(0, 3);
    }, [tasks]);

    // 2. Filtered & Sorted tasks
    const filteredTasks = useMemo(() => {
        const list = tasks.filter((t) => {
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

    // 3. Master Streak calculations
    const masterStreak = stats?.masterStreak || 0;
    const bestMasterStreak = Math.max(masterStreak, stats?.bestMasterStreak || 0);

    const recordProgress =
        bestMasterStreak > 0
            ? Math.min(100, Math.round((masterStreak / bestMasterStreak) * 100))
            : masterStreak > 0
            ? 100
            : 0;
    const daysToRecord = Math.max(0, bestMasterStreak - masterStreak);
    const isNewRecord = masterStreak >= bestMasterStreak && masterStreak > 0;

    return {
        hallOfFame,
        filteredTasks,
        masterStreak,
        bestMasterStreak,
        recordProgress,
        daysToRecord,
        isNewRecord,
    };
}
