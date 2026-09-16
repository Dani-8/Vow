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