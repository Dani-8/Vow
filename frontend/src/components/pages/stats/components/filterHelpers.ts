import { DayActivity } from '../statsHelpers';
import { AnalyticsFilterState } from './StatsControlBar';

/**
 * Filter DayActivities by time range, day of week, and execution type
 */
export function filterActivities(
    rawHeatmap: DayActivity[],
    filters: AnalyticsFilterState
): DayActivity[] {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // 1. Calculate Cutoff Date from filters.timeRange
    let daysToInclude = 30;
    let customStart: Date | null = null;
    let customEnd: Date | null = null;

    if (filters.timeRange === '7d') daysToInclude = 7;
    else if (filters.timeRange === '14d') daysToInclude = 14;
    else if (filters.timeRange === '30d') daysToInclude = 30;
    else if (filters.timeRange === '90d') daysToInclude = 90;
    else if (filters.timeRange === 'custom') {
        if (filters.customStartDate) customStart = new Date(filters.customStartDate);
        if (filters.customEndDate) {
            customEnd = new Date(filters.customEndDate);
            customEnd.setHours(23, 59, 59, 999);
        }
    }