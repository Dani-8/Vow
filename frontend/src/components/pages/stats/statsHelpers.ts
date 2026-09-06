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