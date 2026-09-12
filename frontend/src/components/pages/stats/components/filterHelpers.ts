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

    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - daysToInclude);
    cutoffDate.setHours(0, 0, 0, 0);

    return rawHeatmap
        .filter((act) => {
            const actDate = new Date(act.date);

            // Time horizon check
            if (customStart || customEnd) {
                if (customStart && actDate < customStart) return false;
                if (customEnd && actDate > customEnd) return false;
            } else {
                if (actDate < cutoffDate) return false;
            }

            // Day of week check
            if (filters.dayOfWeek === 'weekdays') {
                if (act.dayOfWeek === 0 || act.dayOfWeek === 6) return false;
            } else if (filters.dayOfWeek === 'weekends') {
                if (act.dayOfWeek !== 0 && act.dayOfWeek !== 6) return false;
            } else if (typeof filters.dayOfWeek === 'number') {
                if (act.dayOfWeek !== filters.dayOfWeek) return false;
            }

            return true;
        })