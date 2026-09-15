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

    return (
        <div className="space-y-6 pb-12">
            {/* 3-Tab Navigator */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center space-x-2 neu-inset p-1.5 rounded-2xl bg-[#E0E5EC]/90 border border-white/60">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            activeTab === 'overview'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Overview Hub</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            activeTab === 'analytics'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Deep Analytics</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('streaks')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            activeTab === 'streaks'
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                    >
                        <Trophy className="w-4 h-4" />
                        <span>Streak Records & Vault</span>
                    </button>
                </div>

                <div className="hidden sm:flex items-center space-x-3 text-xs font-bold">
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl neu-inset bg-[#E0E5EC]/80">
                        <span className="text-[10px] uppercase font-extrabold text-[#717699]">Consistency</span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black text-white bg-[#549acb]">
                            {overview.consistencyScore}%
                        </span>
                        <span className="text-[10px] text-[#717699]">({overview.consistencyGrade})</span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl neu-inset bg-[#E0E5EC]/80 text-[#717699]">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Master: <strong className="text-[#1a1c35]">{overview.masterStreak}d</strong></span>
                        <span className="text-[10px] text-[#717699] border-l border-slate-300 pl-1.5">
                            Best: <strong className="text-[#549acb]">{overview.bestMasterStreak}d</strong>
                        </span>
                    </div>
                </div>
            </div>