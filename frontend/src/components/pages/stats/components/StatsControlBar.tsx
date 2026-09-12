import React, { useState, useRef, useEffect } from 'react';
import {
    Calendar,
    ChevronDown,
    X,
    Filter,
    Layers,
    RotateCcw,
    Check,
} from 'lucide-react';

export type TimeRangeOption = '7d' | '14d' | '30d' | '90d' | 'custom';
export type DayOfWeekOption = 'all' | 'weekdays' | 'weekends' | 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ExecutionTypeOption = 'all' | 'challenges' | 'tasks';

export interface AnalyticsFilterState {
    timeRange: TimeRangeOption;
    customStartDate?: string;
    customEndDate?: string;
    dayOfWeek: DayOfWeekOption;
    executionType: ExecutionTypeOption;
}

interface StatsControlBarProps {
    filters: AnalyticsFilterState;
    onChangeFilters: (newFilters: AnalyticsFilterState) => void;
    activeCategoryFilter: string | null;
    onResetCategoryFilter: () => void;
}

const TIME_OPTIONS: { id: TimeRangeOption; label: string; sub: string }[] = [
    { id: '7d', label: '7 Days', sub: 'Past 1 week pace' },
    { id: '14d', label: '14 Days', sub: 'Past 2 weeks pace' },
    { id: '30d', label: '30 Days', sub: 'Monthly horizon (Default)' },
    { id: '90d', label: '90 Days', sub: 'Quarterly macro view' },
    { id: 'custom', label: 'Custom Range', sub: 'Select start & end date' },
];

const EXECUTION_OPTIONS: { id: ExecutionTypeOption; label: string; sub: string; color: string }[] = [
    { id: 'all', label: 'All Executions', sub: 'Sprints + Tasks combined', color: '#6366f1' },
    { id: 'challenges', label: 'Sprint Challenges', sub: 'Only active sprint logs', color: '#d97706' },
    { id: 'tasks', label: 'Individual Tasks', sub: 'Standalone tasks only', color: '#059669' },
];

const DAY_OPTIONS: { id: DayOfWeekOption; label: string; sub: string }[] = [
    { id: 'all', label: 'All 7 Days', sub: 'Full week breakdown' },
    { id: 'weekdays', label: 'Weekdays Only', sub: 'Monday through Friday' },
    { id: 'weekends', label: 'Weekends Only', sub: 'Saturday & Sunday' },
    { id: 1, label: 'Mondays', sub: 'Mon cadence' },
    { id: 2, label: 'Tuesdays', sub: 'Tue cadence' },
    { id: 3, label: 'Wednesdays', sub: 'Wed cadence' },
    { id: 4, label: 'Thursdays', sub: 'Thu cadence' },
    { id: 5, label: 'Fridays', sub: 'Fri cadence' },
    { id: 6, label: 'Saturdays', sub: 'Sat cadence' },
    { id: 0, label: 'Sundays', sub: 'Sun cadence' },
];
