import React, { useState, useEffect, useMemo } from 'react';
import { MasterStreakStats, Task, Challenge } from '../../../types';
import { TaskMap } from '../task-map/types';
import { api } from '../../../api';
import { StatsMetricGrid } from './components/StatsMetricGrid';
import { StatsActivityHeatmap } from './components/StatsActivityHeatmap';
import { StatsActiveEcosystem } from './components/StatsActiveEcosystem';
import { StatsDeepAnalytics } from './components/StatsDeepAnalytics';
import { StatsStreakRecords } from './components/StatsStreakRecords';
import { LayoutDashboard, BarChart3, Trophy, Flame } from 'lucide-react';
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

export type StatsTab = 'overview' | 'analytics' | 'streaks';