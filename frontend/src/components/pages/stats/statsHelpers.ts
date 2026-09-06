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
