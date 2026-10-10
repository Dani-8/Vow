import React, { useState, useEffect, useMemo } from 'react';
import { MasterStreakStats, Task, Challenge } from '../../../types';
import { TaskMap } from '../task-map/types';
import { api } from '../../../api';
import { StatsOverviewTab } from './tabs/overview/StatsOverviewTab';
import { StatsDeepAnalyticsTab } from './tabs/deepAnalytics/StatsDeepAnalyticsTab';
import { StatsStreakRecordsTab } from './tabs/streakRecords/StatsStreakRecordsTab';
import { LayoutDashboard, BarChart3, Trophy } from 'lucide-react';
import {
    calculateEcosystemOverview,
    generateActivityHeatmap,
    calculateCategoryDistribution,
} from './statsHelpers';

interface StatsViewProps {
    stats: MasterStreakStats | null;
    tasks: Task[];
    privateTasks: Task[];
    challenges?: Challenge[];
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}