import React from 'react';
import { Trophy, Compass, ArrowRight, Flame, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { Challenge } from '../../../../types';
import { TaskMap } from '../../task-map/types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { getMapSlug } from '../../task-map/TaskMapPage';

interface StatsActiveEcosystemProps {
    challenges: Challenge[];
    taskMaps: TaskMap[];
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const StatsActiveEcosystem: React.FC<StatsActiveEcosystemProps> = ({
    challenges,
    taskMaps,
    onNavigateToView,
}) => {
    const activeChallenges = challenges.filter((c) => (c.status || 'active') === 'active').slice(0, 3);
    const primaryMaps = taskMaps.slice(0, 3);