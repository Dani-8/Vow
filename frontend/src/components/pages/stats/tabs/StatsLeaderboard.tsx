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
