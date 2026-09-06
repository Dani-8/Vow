import { Task, Challenge, MasterStreakStats } from '../../../types';
import { TaskMap } from '../task-map/types';
import { getSubTasksForTaskId } from '../../../utils/subtaskStorage';

export interface DayActivity {
    date: string; // YYYY-MM-DD
    displayDate: string; // e.g., "Sep 5, 2026"
    dayOfWeek: number; // 0 (Sun) - 6 (Sat)
    weekIndex: number;
    totalActions: number;
    challengeActions: number;
    taskActions: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface CategoryBreakdownItem {
    name: string;
    key: string;
    itemCount: number;
    completedCount: number;
    percentage: number;
    color: string;
    iconId: string;
}

export interface EcosystemOverview {
    // Consistency
    consistencyScore: number;
    consistencyGrade: 'Mastery' | 'Elite' | 'Strong' | 'Building';
    activeDaysLast30: number;

    // Challenge Metrics
    totalChallenges: number;
    activeChallengesCount: number;
    completedSprintsCount: number;
    totalSprintLogsCount: number;
    totalTrophiesEarned: number;

    // Roadmap Metrics
    totalMaps: number;
    totalMapNodes: number;
    completedMapNodes: number;
    roadmapCompletionRate: number;

    // Task & Subtask Metrics
    totalTasks: number;
    completedTasks: number;
    totalSubtasks: number;
    completedSubtasks: number;
    overallTaskCompletionRate: number;

    // Streak Records
    masterStreak: number;
    bestMasterStreak: number;
    topTaskStreak: { title: string; streak: number; best: number } | null;
}

/**
 * Format a Date object into YYYY-MM-DD string
 */
export const formatDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * Compute the Unified Ecosystem Overview
 */
export function calculateEcosystemOverview(
    tasks: Task[],
    challenges: Challenge[],
    taskMaps: TaskMap[],
    stats: MasterStreakStats | null
): EcosystemOverview {
    const today = new Date();
    const last30DaysSet = new Set<string>();
    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last30DaysSet.add(formatDateKey(d));
    }

    const activeDaysInLast30 = new Set<string>();

    // 1. Challenge Metrics
    const totalChallenges = challenges.length;
    const activeChallengesCount = challenges.filter((c) => (c.status || 'active') === 'active').length;
    let completedSprintsCount = 0;
    let totalSprintLogsCount = 0;
    let totalTrophiesEarned = 0;

    challenges.forEach((ch) => {
        // Count trophies earned (milestones reached)
        const totalCompletedLogs = (ch.logs || []).filter((l) => l.status === 'completed').length;
        if (totalCompletedLogs >= 25) totalTrophiesEarned++;
        if (totalCompletedLogs >= 50) totalTrophiesEarned++;
        if (totalCompletedLogs >= 75) totalTrophiesEarned++;
        if (totalCompletedLogs >= 100) totalTrophiesEarned++;

        // Track active days
        (ch.logs || []).forEach((l) => {
            if (l.status === 'completed' || l.status === 'rest') {
                totalSprintLogsCount++;
                const logDate = l.date ? l.date.split('T')[0] : '';
                if (last30DaysSet.has(logDate)) {
                    activeDaysInLast30.add(logDate);
                }
            }
        });

        // Sprints
        if (ch.sprints && ch.sprints.length > 0) {
            completedSprintsCount += ch.sprints.filter((s) => s.status === 'completed').length;
        }
    });

    // 2. Roadmap Metrics
    const totalMaps = taskMaps.length;
    let totalMapNodes = 0;
    let completedMapNodes = 0;

    taskMaps.forEach((map) => {
        const nodes = map.nodes || [];
        totalMapNodes += nodes.length;
        nodes.forEach((node) => {
            if (node.customStatus === 'completed') {
                completedMapNodes++;
            } else {
                // Check linked task / subtask
                const linkedTask = tasks.find((t) => t._id === node.taskId);
                if (linkedTask) {
                    if (node.subTaskId) {
                        const subs = getSubTasksForTaskId(linkedTask._id, linkedTask.subTasks);
                        const targetSub = subs.find((s) => s.id === node.subTaskId);
                        if (targetSub?.status === 'completed') {
                            completedMapNodes++;
                        }
                    } else if (linkedTask.status === 'completed' || linkedTask.completedToday) {
                        completedMapNodes++;
                    }
                }
            }
        });
    });

    const roadmapCompletionRate = totalMapNodes > 0 ? Math.round((completedMapNodes / totalMapNodes) * 100) : 0;

    // 3. Task & Subtask Metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed' || t.completedToday).length;
    let totalSubtasks = 0;
    let completedSubtasks = 0;

    let topTaskStreak: { title: string; streak: number; best: number } | null = null;

    tasks.forEach((t) => {
        const subs = getSubTasksForTaskId(t._id, t.subTasks);
        totalSubtasks += subs.length;
        completedSubtasks += subs.filter((s) => s.status === 'completed').length;

        const curStreak = t.currentStreak || 0;
        const bestStreak = t.bestStreak || 0;

        if (!topTaskStreak || curStreak > topTaskStreak.streak || bestStreak > topTaskStreak.best) {
            topTaskStreak = {
                title: t.title,
                streak: curStreak,
                best: Math.max(bestStreak, curStreak),
            };
        }

        // If completed or has streak today
        if (t.completedToday || (t.currentStreak && t.currentStreak > 0)) {
            activeDaysInLast30.add(formatDateKey(today));
        }
    });

    const totalTrackedItems = totalTasks + totalSubtasks;
    const totalCompletedItems = completedTasks + completedSubtasks;
    const overallTaskCompletionRate =
        totalTrackedItems > 0 ? Math.round((totalCompletedItems / totalTrackedItems) * 100) : 0;

    // 4. Consistency Calculation
    // Base active days out of 30 + weighted bonus for streak stability
    const activeDaysCount = Math.min(30, activeDaysInLast30.size + (stats?.masterStreak ? Math.min(stats.masterStreak, 15) : 0));
    const baseConsistency = Math.round((activeDaysCount / 30) * 100);
    const consistencyScore = Math.min(100, Math.max(baseConsistency, stats?.masterStreak ? 70 : 50));

    let consistencyGrade: 'Mastery' | 'Elite' | 'Strong' | 'Building' = 'Building';
    if (consistencyScore >= 90) consistencyGrade = 'Mastery';
    else if (consistencyScore >= 80) consistencyGrade = 'Elite';
    else if (consistencyScore >= 65) consistencyGrade = 'Strong';

    return {
        consistencyScore,
        consistencyGrade,
        activeDaysLast30: activeDaysCount,
        totalChallenges,
        activeChallengesCount,
        completedSprintsCount,
        totalSprintLogsCount,
        totalTrophiesEarned,
        totalMaps,
        totalMapNodes,
        completedMapNodes,
        roadmapCompletionRate,
        totalTasks,
        completedTasks,
        totalSubtasks,
        completedSubtasks,
        overallTaskCompletionRate,
        masterStreak: stats?.masterStreak || 0,
        bestMasterStreak: Math.max(stats?.masterStreak || 0, stats?.bestMasterStreak || 0),
        topTaskStreak,
    };
}

/**
 * Generate 16 weeks (112 days) of activity for the Heatmap Grid
 */
export function generateActivityHeatmap(
    tasks: Task[],
    challenges: Challenge[],
    totalWeeks: number = 52
): DayActivity[] {
    const totalDays = totalWeeks * 7;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Map of date string -> { challengeCount, taskCount }
    const activityMap: Record<string, { challengeCount: number; taskCount: number }> = {};

    // 1. Process Challenge logs
    challenges.forEach((ch) => {
        (ch.logs || []).forEach((log) => {
            if (log.status === 'completed' || log.status === 'rest') {
                const dateKey = log.date ? log.date.split('T')[0] : '';
                if (dateKey) {
                    if (!activityMap[dateKey]) activityMap[dateKey] = { challengeCount: 0, taskCount: 0 };
                    activityMap[dateKey].challengeCount++;
                }
            }
        });
    });

    // 2. Process tasks and subtask activity (seed current active streak days)
    const activeStreakLength = Math.min(30, Math.max(...tasks.map((t) => t.currentStreak || 0), 1));
    for (let i = 0; i < activeStreakLength; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const k = formatDateKey(d);
        if (!activityMap[k]) activityMap[k] = { challengeCount: 0, taskCount: 0 };
        activityMap[k].taskCount += (i === 0 ? tasks.filter((t) => t.completedToday || t.status === 'completed').length || 2 : 2);
    }

    const result: DayActivity[] = [];