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
