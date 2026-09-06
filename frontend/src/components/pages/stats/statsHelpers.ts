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