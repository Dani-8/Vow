import React from 'react';
import { Flame, Trophy, Compass, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { EcosystemOverview } from '../../../statsHelpers';

interface OverviewMetricGridProps {
    overview: EcosystemOverview;
    onSelectTab?: (tab: 'overview' | 'analytics' | 'streaks') => void;
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const OverviewMetricGrid: React.FC<OverviewMetricGridProps> = ({
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