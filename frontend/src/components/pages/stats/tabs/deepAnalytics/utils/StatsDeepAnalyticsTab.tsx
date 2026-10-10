import React, { useState } from 'react';
import {
    CategoryBreakdownItem,
    DayActivity,
    EcosystemOverview,
} from '../../statsHelpers';
import { Task, Challenge } from '../../../../../types';
import { TaskMap } from '../../../task-map/types';
import { AnalyticsMomentumEngine } from './components/AnalyticsMomentumEngine';
import {
    AnalyticsControlBar,
    AnalyticsFilterState,
} from './components/AnalyticsControlBar';
import { useDeepAnalyticsData } from './hooks/useDeepAnalyticsData';
import { AnalyticsTakeawayKPIs } from './components/AnalyticsTakeawayKPIs';
import { AnalyticsDomainRadar } from './components/AnalyticsDomainRadar';
import { AnalyticsFocusDonut } from './components/AnalyticsFocusDonut';
import { AnalyticsBacklogBar } from './components/AnalyticsBacklogBar';
import { AnalyticsCadenceArea } from './components/AnalyticsCadenceArea';

interface StatsDeepAnalyticsTabProps {
    categories: CategoryBreakdownItem[];
    heatmapActivities: DayActivity[];
    overview: EcosystemOverview;
    tasks?: Task[];
    challenges?: Challenge[];
    taskMaps?: TaskMap[];
}

export const StatsDeepAnalyticsTab: React.FC<StatsDeepAnalyticsTabProps> = ({
    categories,
    heatmapActivities,
    overview,
    tasks = [],
    challenges = [],
}) => {
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
    const [filters, setFilters] = useState<AnalyticsFilterState>({
        timeRange: '30d',
        dayOfWeek: 'all',
        executionType: 'all',
    });

    const handleToggleCategory = (catKey: string) => {
        setSelectedCategoryKey((prev) => (prev === catKey ? null : catKey));
    };

    const handleResetCategoryFilter = () => {
        setSelectedCategoryKey(null);
    };

    const {
        normalizedCategories,
        activeCategory,
        currentWindowDays,
        dynamicActivities,
        highestEfficiency,
        highestVolume,
        velocityStats,
        radarData,
        barData,
        cadenceTrend,
    } = useDeepAnalyticsData({
        categories,
        heatmapActivities,
        tasks,
        challenges,
        filters,
        selectedCategoryKey,
    });
