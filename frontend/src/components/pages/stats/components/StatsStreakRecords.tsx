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