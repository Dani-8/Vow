import React from 'react';
import { Flame, Trophy, Compass, CheckCircle2, Award, Layers, Zap } from 'lucide-react';
import { EcosystemOverview } from '../statsHelpers';

interface StatsMetricGridProps {
    overview: EcosystemOverview;
}

export const StatsMetricGrid: React.FC<StatsMetricGridProps> = ({ overview }) => {
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
