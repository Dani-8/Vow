import React from 'react';
import { Challenge } from '../../../../../types';
import { TaskMap } from '../../../task-map/types';
import { EcosystemOverview, DayActivity } from '../../statsHelpers';
import { OverviewMetricGrid } from './components/OverviewMetricGrid';
import { OverviewActivityHeatmap } from './components/OverviewActivityHeatmap';
import { OverviewEcosystem } from './components/OverviewEcosystem';
import { OverviewFocusMetricCard } from './components/OverviewFocusMetricCard';

interface StatsOverviewTabProps {
    overview: EcosystemOverview;
    heatmapActivities: DayActivity[];
    challenges: Challenge[];
    taskMaps: TaskMap[];
    onSelectTab: (tab: 'overview' | 'analytics' | 'streaks') => void;
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const StatsOverviewTab: React.FC<StatsOverviewTabProps> = ({
    overview,
    heatmapActivities,
    challenges,
    taskMaps,
    onSelectTab,
    onNavigateToView,
}) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Unified 4-Pillar Metric Grid */}
            <OverviewMetricGrid
                overview={overview}
                onSelectTab={onSelectTab}
                onNavigateToView={onNavigateToView}
            />

            {/* Deep Focus Insights Card (Timer & Sprint Hours) */}
            <OverviewFocusMetricCard challenges={challenges} />

            {/* 52-Week / 365-Day Unified Execution Heatmap */}
            <OverviewActivityHeatmap activities={heatmapActivities} />

            {/* Active Sprints & Roadmaps Command Hub */}
            <OverviewEcosystem
                challenges={challenges}
                taskMaps={taskMaps}
                onNavigateToView={onNavigateToView}
            />
        </div>
    );
};
