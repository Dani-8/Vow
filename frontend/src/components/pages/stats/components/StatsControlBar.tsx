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

export const StatsControlBar: React.FC<StatsControlBarProps> = ({
    filters,
    onChangeFilters,
    activeCategoryFilter,
    onResetCategoryFilter,
}) => {
    // Dropdown open states: only 3 clean dropdowns
    const [openDropdown, setOpenDropdown] = useState<'range' | 'type' | 'day' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (menu: 'range' | 'type' | 'day') => {
        setOpenDropdown((prev) => (prev === menu ? null : menu));
    };

    const handleSelectTimeRange = (range: TimeRangeOption) => {
        onChangeFilters({ ...filters, timeRange: range });
        if (range !== 'custom') {
            setOpenDropdown(null);
        }
    };

    const handleSelectExecutionType = (type: ExecutionTypeOption) => {
        onChangeFilters({ ...filters, executionType: type });
        setOpenDropdown(null);
    };

    const handleSelectDayOfWeek = (day: DayOfWeekOption) => {
        onChangeFilters({ ...filters, dayOfWeek: day });
        setOpenDropdown(null);
    };

    const handleResetAll = () => {
        onResetCategoryFilter();
        setOpenDropdown(null);
        onChangeFilters({
            timeRange: '30d',
            customStartDate: undefined,
            customEndDate: undefined,
            dayOfWeek: 'all',
            executionType: 'all',
        });
    };

    const isAnyFilterActive =
        filters.timeRange !== '30d' ||
        filters.dayOfWeek !== 'all' ||
        filters.executionType !== 'all' ||
        activeCategoryFilter !== null;

    // Derived active labels
    const currentRangeLabel =
        filters.timeRange === 'custom'
            ? 'Custom Range'
            : TIME_OPTIONS.find((t) => t.id === filters.timeRange)?.label || '30 Days';

    const currentExecution = EXECUTION_OPTIONS.find((e) => e.id === filters.executionType) || EXECUTION_OPTIONS[0];
    const currentDayLabel = DAY_OPTIONS.find((d) => d.id === filters.dayOfWeek)?.label || 'All 7 Days';
