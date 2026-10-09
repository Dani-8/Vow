import React from 'react';
import { Flame, Trophy, Compass, CheckCircle2, Award, Layers, Zap, ArrowUpRight } from 'lucide-react';
import { EcosystemOverview } from '../statsHelpers';

interface StatsMetricGridProps {
    overview: EcosystemOverview;
    onSelectTab?: (tab: 'overview' | 'analytics' | 'streaks') => void;
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const StatsMetricGrid: React.FC<StatsMetricGridProps> = ({
    overview,
    onSelectTab,
    onNavigateToView,
}) => {
    const {
        masterStreak,
        bestMasterStreak,
        totalSprintLogsCount,
        activeChallengesCount,
        totalTrophiesEarned,
        completedMapNodes,
        totalMapNodes,
        roadmapCompletionRate,
        completedSubtasks,
        totalSubtasks,
        completedTasks,
        totalTasks,
        overallTaskCompletionRate,
    } = overview;

    const cards = [
        {
            id: 'pillar-streak',
            title: 'Master Streak',
            badge: 'Global Resilience',
            icon: Flame,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-500/10',
            primaryValue: `${masterStreak}d`,
            primaryLabel: 'Current Master Streak',
            secondaryValue: `${bestMasterStreak}d Record`,
            secondaryLabel: 'All-Time High',
            progressPercent: Math.min(100, Math.round((masterStreak / Math.max(bestMasterStreak, 1)) * 100)),
            progressColor: 'from-amber-400 to-amber-600',
            subText: masterStreak >= bestMasterStreak && masterStreak > 0
                ? '⚡ Currently matching or setting an all-time record!'
                : `Aiming to beat your personal best of ${bestMasterStreak} days.`,
            actionLabel: 'Open Streak Vault',
            onClick: () => onSelectTab?.('streaks'),
        },
        {
            id: 'pillar-challenges',
            title: 'Active Challenges',
            badge: `${activeChallengesCount} Active`,
            icon: Trophy,
            iconColor: 'text-[#549acb]',
            iconBg: 'bg-[#549acb]/10',
            primaryValue: `${totalSprintLogsCount}d`,
            primaryLabel: 'Total Days Logged',
            secondaryValue: `${totalTrophiesEarned} Badges`,
            secondaryLabel: 'Milestone Trophies',
            progressPercent: Math.min(100, (totalSprintLogsCount % 100)),
            progressColor: 'from-[#549acb] to-[#38bdf8]',
            subText: `${activeChallengesCount} challenge${activeChallengesCount === 1 ? '' : 's'} actively in progress.`,
            actionLabel: 'Explore Sprints',
            onClick: () => onNavigateToView?.('challenges'),
        },
        {
            id: 'pillar-roadmap',
            title: 'Task Map Velocity',
            badge: `${roadmapCompletionRate}% Cleared`,
            icon: Compass,
            iconColor: 'text-indigo-600',
            iconBg: 'bg-indigo-500/10',
            primaryValue: `${completedMapNodes}`,
            primaryLabel: `Nodes Conquered (${totalMapNodes} total)`,
            secondaryValue: `${overview.totalMaps} Maps`,
            secondaryLabel: 'Strategic Blueprints',
            progressPercent: roadmapCompletionRate,
            progressColor: 'from-indigo-500 to-blue-500',
            subText: `${totalMapNodes - completedMapNodes} remaining milestone node${(totalMapNodes - completedMapNodes) === 1 ? '' : 's'} to unlock.`,
            actionLabel: 'View Blueprints',
            onClick: () => onNavigateToView?.('task-map'),
        },
        {
            id: 'pillar-tasks',
            title: 'Subtask & Task Engine',
            badge: `${overallTaskCompletionRate}% Clearance`,
            icon: CheckCircle2,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-500/10',
            primaryValue: `${completedTasks + completedSubtasks}`,
            primaryLabel: 'Items Executed',
            secondaryValue: `${completedSubtasks} / ${totalSubtasks}`,
            secondaryLabel: 'Subtasks Finished',
            progressPercent: overallTaskCompletionRate,
            progressColor: 'from-emerald-500 to-teal-500',
            subText: `${completedTasks} of ${totalTasks} top-level tasks marked complete.`,
            actionLabel: 'Deep Analytics',
            onClick: () => onSelectTab?.('analytics'),
        },
    ];