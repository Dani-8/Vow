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

    return (
        <div
            ref={containerRef}
            className="neu-card p-3 rounded-2xl border border-white/60 bg-[#E0E5EC] transition-all"
        >
            {/* Unified Sleek Slicer Row */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
                {/* Left: 3 Essential Custom Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#717699] mr-1 hidden sm:flex items-center space-x-1">
                        <Filter className="w-3.5 h-3.5 text-[#549acb]" />
                        <span>Filter:</span>
                    </span>

                    {/* 1. Custom Dropdown: TIME RANGE */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('range')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${openDropdown === 'range' || filters.timeRange !== '30d'
                                ? 'neu-button bg-[#E0E5EC] text-[#549acb] shadow-inner ring-1 ring-[#549acb]/30'
                                : 'neu-inset text-[#1a1c35] hover:text-[#549acb]'
                                }`}
                        >
                            <Calendar className="w-3.5 h-3.5 text-[#549acb]" />
                            <span>{currentRangeLabel}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-[#717699] transition-transform duration-200 ${openDropdown === 'range' ? 'rotate-180 text-[#549acb]' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === 'range' && (
                            <div className="absolute left-0 mt-2 w-64 z-50 neu-card rounded-2xl p-2 bg-[#E0E5EC] border border-white/80 shadow-2xl space-y-1 animate-fadeIn">
                                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#717699] border-b border-slate-300/60">
                                    Time Horizon
                                </div>
                                {TIME_OPTIONS.map((opt) => {
                                    const isSelected = filters.timeRange === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => handleSelectTimeRange(opt.id)}
                                            className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between ${isSelected
                                                ? 'neu-button bg-[#E0E5EC] text-[#549acb] font-black'
                                                : 'hover:bg-white/40 text-[#1a1c35]'
                                                }`}
                                        >
                                            <div>
                                                <div className="text-xs font-black leading-tight">
                                                    {opt.label}
                                                </div>
                                                <div className="text-[10px] text-[#717699] font-medium">
                                                    {opt.sub}
                                                </div>
                                            </div>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-[#549acb]" />}
                                        </button>
                                    );
                                })}

                                {/* Inline Custom Date Pickers if Custom is active */}
                                {filters.timeRange === 'custom' && (
                                    <div className="p-2.5 neu-inset rounded-xl bg-[#E0E5EC]/90 space-y-2 mt-1 border border-slate-300/70">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-extrabold uppercase text-[#717699]">
                                                Start:
                                            </span>
                                            <input
                                                type="date"
                                                value={filters.customStartDate || ''}
                                                onChange={(e) =>
                                                    onChangeFilters({
                                                        ...filters,
                                                        customStartDate: e.target.value,
                                                    })
                                                }
                                                className="bg-transparent text-xs font-bold text-[#1a1c35] focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-extrabold uppercase text-[#717699]">
                                                End:
                                            </span>
                                            <input
                                                type="date"
                                                value={filters.customEndDate || ''}
                                                onChange={(e) =>
                                                    onChangeFilters({
                                                        ...filters,
                                                        customEndDate: e.target.value,
                                                    })
                                                }
                                                className="bg-transparent text-xs font-bold text-[#1a1c35] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2. Custom Dropdown: EXECUTION TYPE */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('type')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${openDropdown === 'type' || filters.executionType !== 'all'
                                ? 'neu-button bg-[#E0E5EC] text-[#6366f1] shadow-inner ring-1 ring-[#6366f1]/30'
                                : 'neu-inset text-[#1a1c35] hover:text-[#6366f1]'
                                }`}
                        >
                            <Layers className="w-3.5 h-3.5 text-[#6366f1]" />
                            <span>{currentExecution.label}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-[#717699] transition-transform duration-200 ${openDropdown === 'type' ? 'rotate-180 text-[#6366f1]' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === 'type' && (
                            <div className="absolute left-0 mt-2 w-60 z-50 neu-card rounded-2xl p-2 bg-[#E0E5EC] border border-white/80 shadow-2xl space-y-1 animate-fadeIn">
                                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#717699] border-b border-slate-300/60">
                                    Execution Type
                                </div>
                                {EXECUTION_OPTIONS.map((opt) => {
                                    const isSelected = filters.executionType === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => handleSelectExecutionType(opt.id)}
                                            className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between ${isSelected
                                                ? 'neu-button bg-[#E0E5EC] font-black'
                                                : 'hover:bg-white/40 text-[#1a1c35]'
                                                }`}
                                        >
                                            <div>
                                                <div
                                                    className="text-xs font-black leading-tight"
                                                    style={{ color: opt.color }}
                                                >
                                                    {opt.label}
                                                </div>
                                                <div className="text-[10px] text-[#717699] font-medium">
                                                    {opt.sub}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5" style={{ color: opt.color }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* 3. Custom Dropdown: DAY OF WEEK */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('day')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${openDropdown === 'day' || filters.dayOfWeek !== 'all'
                                ? 'neu-button bg-[#E0E5EC] text-[#549acb] shadow-inner ring-1 ring-[#549acb]/30'
                                : 'neu-inset text-[#1a1c35] hover:text-[#549acb]'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#549acb]" />
                            <span>{currentDayLabel}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-[#717699] transition-transform duration-200 ${openDropdown === 'day' ? 'rotate-180 text-[#549acb]' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === 'day' && (
                            <div className="absolute left-0 mt-2 w-56 z-50 neu-card rounded-2xl p-2 bg-[#E0E5EC] border border-white/80 shadow-2xl space-y-1 animate-fadeIn max-h-72 overflow-y-auto">
                                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#717699] border-b border-slate-300/60">
                                    Day Breakdown
                                </div>
                                {DAY_OPTIONS.map((opt) => {
                                    const isSelected = filters.dayOfWeek === opt.id;
                                    return (
                                        <button
                                            key={String(opt.id)}
                                            type="button"
                                            onClick={() => handleSelectDayOfWeek(opt.id)}
                                            className={`w-full px-3 py-1.5 rounded-xl text-left transition-all flex items-center justify-between ${isSelected
                                                ? 'neu-button bg-[#E0E5EC] text-[#549acb] font-black'
                                                : 'hover:bg-white/40 text-[#1a1c35]'
                                                }`}
                                        >
                                            <span className="text-xs font-bold">{opt.label}</span>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-[#549acb]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Actions: Domain Badge & Reset */}
                <div className="flex items-center space-x-2 ml-auto">
                    {/* Active Category Cross-Filter Pill */}
                    {activeCategoryFilter && (
                        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl neu-inset text-xs font-black text-[#549acb]">
                            <span>Domain: {activeCategoryFilter}</span>
                            <button
                                onClick={onResetCategoryFilter}
                                className="hover:text-red-500 ml-1 p-0.5 transition-colors"
                                title="Remove domain filter"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Reset Action */}
                    {isAnyFilterActive && (
                        <button
                            onClick={handleResetAll}
                            className="neu-button px-3 py-1.5 rounded-xl text-xs font-black text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5 transition-all"
                            title="Reset all filters back to default"
                        >
                            <RotateCcw className="w-3 h-3 text-[#549acb]" />
                            <span>Reset All</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
