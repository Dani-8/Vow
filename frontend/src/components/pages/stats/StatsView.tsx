import React, { useState, useEffect, useMemo } from 'react';
import { MasterStreakStats, Task, Challenge } from '../../../types';
import { TaskMap } from '../task-map/types';
import { api } from '../../../api';
import { StatsMetricGrid } from './components/StatsMetricGrid';
import { StatsActivityHeatmap } from './components/StatsActivityHeatmap';
import { StatsActiveEcosystem } from './components/StatsActiveEcosystem';
import { StatsDeepAnalytics } from './components/StatsDeepAnalytics';
import { StatsStreakRecords } from './components/StatsStreakRecords';
import { LayoutDashboard, BarChart3, Trophy, Flame } from 'lucide-react';
import {
    calculateEcosystemOverview,
    generateActivityHeatmap,
    calculateCategoryDistribution,
} from './statsHelpers';

interface StatsViewProps {
    stats: MasterStreakStats | null;
    tasks: Task[];
    privateTasks: Task[];
    challenges?: Challenge[];
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export type StatsTab = 'overview' | 'analytics' | 'streaks';

export const StatsView: React.FC<StatsViewProps> = ({
    stats,
    tasks,
    privateTasks,
    challenges = [],
    onNavigateToView,
}) => {
    const [activeTab, setActiveTab] = useState<StatsTab>('overview');
    const [taskMaps, setTaskMaps] = useState<TaskMap[]>([]);

    // Combine all tasks
    const allTasks = useMemo(() => [...tasks, ...privateTasks], [tasks, privateTasks]);

    // Fetch task maps for roadmap metrics
    useEffect(() => {
        api.getTaskMaps()
            .then((res) => {
                if (res.maps && Array.isArray(res.maps)) {
                    setTaskMaps(res.maps);
                }
            })
            .catch((err) => {
                console.warn('Could not fetch task maps for stats overview:', err);
            });
    }, []);
