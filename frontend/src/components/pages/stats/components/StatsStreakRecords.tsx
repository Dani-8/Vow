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
