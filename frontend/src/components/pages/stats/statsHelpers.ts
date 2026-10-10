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

    // Calculate start date aligned to the nearest Sunday totalWeeks ago
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + (6 - currentDayOfWeek));
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < totalDays; i++) {
        const cur = new Date(startDate);
        cur.setDate(startDate.getDate() + i);
        const dateKey = formatDateKey(cur);

        const data = activityMap[dateKey] || { challengeCount: 0, taskCount: 0 };
        const totalActions = data.challengeCount + data.taskCount;

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (totalActions >= 5) level = 4;
        else if (totalActions >= 3) level = 3;
        else if (totalActions >= 2) level = 2;
        else if (totalActions >= 1) level = 1;

        result.push({
            date: dateKey,
            displayDate: cur.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            dayOfWeek: cur.getDay(),
            weekIndex: Math.floor(i / 7),
            totalActions,
            challengeActions: data.challengeCount,
            taskActions: data.taskCount,
            level,
        });
    }

    return result;
}

export const categorize = (rawCategory?: string, rawTitle?: string): string => {
    const text = `${rawCategory || ''} ${rawTitle || ''}`.toLowerCase();
    if (text.includes('code') || text.includes('dev') || text.includes('react') || text.includes('api') || text.includes('tech') || text.includes('app')) {
        return 'Tech & Engineering';
    }
    if (text.includes('fit') || text.includes('run') || text.includes('gym') || text.includes('workout') || text.includes('health') || text.includes('diet')) {
        return 'Fitness & Health';
    }
    if (text.includes('read') || text.includes('learn') || text.includes('book') || text.includes('study') || text.includes('russian') || text.includes('language')) {
        return 'Learning & Mind';
    }
    if (text.includes('money') || text.includes('financ') || text.includes('business') || text.includes('invest') || text.includes('career') || text.includes('client')) {
        return 'Business & Finance';
    }
    if (text.includes('creative') || text.includes('art') || text.includes('music') || text.includes('video') || text.includes('design') || text.includes('write')) {
        return 'Creative & Craft';
    }
    return 'Habits & Routine';
};

/**
 * Generate activity heatmap filtered by a specific category name or null for all
 */
export function generateCategoryActivityHeatmap(
    tasks: Task[],
    challenges: Challenge[],
    filterCategoryName: string | null,
    totalWeeks: number = 52
): DayActivity[] {
    const filteredTasks = filterCategoryName
        ? tasks.filter((t) => categorize(t.category || (t.tags && t.tags[0]), t.title) === filterCategoryName)
        : tasks;

    const filteredChallenges = filterCategoryName
        ? challenges.filter((c) => categorize(c.category, c.title) === filterCategoryName)
        : challenges;

    return generateActivityHeatmap(filteredTasks, filteredChallenges, totalWeeks);
}

/**
 * Category & Focus Distribution
 */
export function calculateCategoryDistribution(
    tasks: Task[],
    challenges: Challenge[],
    taskMaps: TaskMap[]
): CategoryBreakdownItem[] {
    const categoryTotals: Record<
        string,
        { itemCount: number; completedCount: number; color: string; iconId: string }
    > = {
        'Tech & Engineering': { itemCount: 0, completedCount: 0, color: '#549acb', iconId: 'code' },
        'Fitness & Health': { itemCount: 0, completedCount: 0, color: '#10b981', iconId: 'dumbbell' },
        'Learning & Mind': { itemCount: 0, completedCount: 0, color: '#8b5cf6', iconId: 'book' },
        'Business & Finance': { itemCount: 0, completedCount: 0, color: '#f59e0b', iconId: 'briefcase' },
        'Habits & Routine': { itemCount: 0, completedCount: 0, color: '#6366f1', iconId: 'calendar' },
        'Creative & Craft': { itemCount: 0, completedCount: 0, color: '#06b6d4', iconId: 'palette' },
    };

    // 1. Tasks
    tasks.forEach((t) => {
        const cat = categorize(t.category || (t.tags && t.tags[0]), t.title);
        categoryTotals[cat].itemCount++;
        if (t.status === 'completed' || t.completedToday) categoryTotals[cat].completedCount++;
    });

    // 2. Challenges
    challenges.forEach((c) => {
        const cat = categorize(c.category, c.title);
        categoryTotals[cat].itemCount += 2; // Weight challenges more heavily
        if (c.status === 'completed') categoryTotals[cat].completedCount += 2;
        else categoryTotals[cat].completedCount += 1;
    });

    // 3. Task Maps
    taskMaps.forEach((m) => {
        const cat = categorize(m.category, m.name);
        categoryTotals[cat].itemCount += 3;
        categoryTotals[cat].completedCount += 2;
    });

    const totalWeight = Object.values(categoryTotals).reduce((sum, c) => sum + c.itemCount, 0);

    return Object.entries(categoryTotals)
        .map(([name, data]) => ({
            name,
            key: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            itemCount: data.itemCount,
            completedCount: data.completedCount,
            percentage: totalWeight > 0 ? Math.round((data.itemCount / totalWeight) * 100) : 0,
            color: data.color,
            iconId: data.iconId,
        }))
        .filter((item) => item.itemCount > 0)
        .sort((a, b) => b.percentage - a.percentage);
}
