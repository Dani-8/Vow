import React, { useState, useEffect, useMemo } from 'react';
import { MasterStreakStats, Task, Challenge } from '../../../types';
import { TaskMap } from '../task-map/types';
import { api } from '../../../api';
import { StatsOverviewTab } from './tabs/overview/StatsOverviewTab';
import { StatsDeepAnalyticsTab } from './tabs/deepAnalytics/StatsDeepAnalyticsTab';
import { StatsStreakRecordsTab } from './tabs/streakRecords/StatsStreakRecordsTab';
import { LayoutDashboard, BarChart3, Trophy } from 'lucide-react';
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

interface TabItem {
    id: StatsTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const STATS_TABS: TabItem[] = [
    { id: 'overview', label: 'Overview Hub', icon: LayoutDashboard },
    { id: 'analytics', label: 'Deep Analytics', icon: BarChart3 },
    { id: 'streaks', label: 'Streak Records & Vault', icon: Trophy },
];

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

    // 1. Ecosystem Overview (Metrics & Consistency)
    const overview = useMemo(
        () => calculateEcosystemOverview(allTasks, challenges, taskMaps, stats),
        [allTasks, challenges, taskMaps, stats]
    );

    // 2. Heatmap Activities (Full 52 weeks / 365 days)
    const heatmapActivities = useMemo(
        () => generateActivityHeatmap(allTasks, challenges, 52),
        [allTasks, challenges]
    );

    // 3. Category & Focus Distribution
    const categoryDistribution = useMemo(
        () => calculateCategoryDistribution(allTasks, challenges, taskMaps),
        [allTasks, challenges, taskMaps]
    );