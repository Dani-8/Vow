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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Active Challenges */}
            <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35]">Active Challenges</h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    Current challenges in progress
                                </p>
                            </div>
                        </div>