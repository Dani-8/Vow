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

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* 1. Global Analytics Control Bar */}
            <AnalyticsControlBar
                filters={filters}
                onChangeFilters={setFilters}
                activeCategoryFilter={activeCategory ? activeCategory.name : null}
                onResetCategoryFilter={handleResetCategoryFilter}
            />

            {/* 2. Top Takeaway KPIs & Domain Filter Banner */}
            <AnalyticsTakeawayKPIs
                activeCategory={activeCategory}
                highestVolume={highestVolume}
                highestEfficiency={highestEfficiency}
                velocityStats={velocityStats}
                selectedCategoryKey={selectedCategoryKey}
                onToggleCategory={handleToggleCategory}
                onResetCategoryFilter={handleResetCategoryFilter}
            />

            {/* 3. Row 1: Domain Radar + Focus Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <AnalyticsDomainRadar
                    radarData={radarData}
                    activeCategoryName={activeCategory?.name || null}
                    isCategoryActive={Boolean(activeCategory)}
                    onToggleCategory={handleToggleCategory}
                />
                <AnalyticsFocusDonut
                    categories={normalizedCategories}
                    activeCategory={activeCategory}
                    selectedCategoryKey={selectedCategoryKey}
                    onToggleCategory={handleToggleCategory}
                    onResetCategoryFilter={handleResetCategoryFilter}
                />
            </div>