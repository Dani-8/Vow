import React from 'react';
import { Challenge } from '../../../../../../types';
import { TaskMap } from '../../../../task-map/types';
import { ActiveChallengesCard } from './ActiveChallengesCard';
import { ActiveRoadmapsCard } from './ActiveRoadmapsCard';

interface OverviewEcosystemProps {
    challenges: Challenge[];
    taskMaps: TaskMap[];
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const OverviewEcosystem: React.FC<OverviewEcosystemProps> = ({
    challenges,
    taskMaps,
    onNavigateToView,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActiveChallengesCard challenges={challenges} onNavigateToView={onNavigateToView} />
            <ActiveRoadmapsCard taskMaps={taskMaps} onNavigateToView={onNavigateToView} />
        </div>
    );
};
