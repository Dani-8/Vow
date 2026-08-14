import { SubTask, Task } from '../types';
import { TaskMapNode } from '../components/pages/task-map/types';

export const SUBTASKS_UPDATED_EVENT = 'vow_subtasks_updated';

/**
 * Retrieves subtasks for a specific task ID, checking localStorage first,
 * then falling back to initialSubTasks.
 */
export function getSubTasksForTaskId(taskId: string, initialSubTasks?: SubTask[]): SubTask[] {
    if (!taskId) return [];
    const storageKey = `vow_subtasks_${taskId}`;
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn(`Error reading subtasks for task ${taskId}:`, e);
    }

    if (initialSubTasks && initialSubTasks.length > 0) {
        // Seed localStorage with initial subtasks
        try {
            localStorage.setItem(storageKey, JSON.stringify(initialSubTasks));
        } catch {
            // ignore
        }
        return initialSubTasks;
    }

    return [];
}

/**
 * Saves subtasks for a task ID and dispatches a window event so all views update in real-time.
 */
export function saveSubTasksForTaskId(taskId: string, subTasks: SubTask[]): void {
    if (!taskId) return;
    const storageKey = `vow_subtasks_${taskId}`;
    try {
        localStorage.setItem(storageKey, JSON.stringify(subTasks));
    } catch (e) {
        console.error(`Error saving subtasks for task ${taskId}:`, e);
    }

    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent(SUBTASKS_UPDATED_EVENT, {
                detail: { taskId, subTasks },
            })
        );
    }
}

/**
 * Calculates subtask completion metrics for a given task ID.
 */
export function calculateTaskSubTaskProgress(taskId: string, fallbackSubTasks?: SubTask[]) {
    const subTasks = getSubTasksForTaskId(taskId, fallbackSubTasks);
    const total = subTasks.length;
    if (total === 0) {
        return {
            completed: 0,
            total: 0,
            percent: 0,
            status: 'todo' as const,
        };
    }

    const completed = subTasks.filter((s) => s.status === 'completed').length;
    const inProgress = subTasks.filter((s) => s.status === 'in_progress').length;
    const percent = Math.round((completed / total) * 100);

    let status: 'todo' | 'in_progress' | 'completed' = 'todo';
    if (completed === total && total > 0) {
        status = 'completed';
    } else if (completed > 0 || inProgress > 0) {
        status = 'in_progress';
    }

    return {
        completed,
        total,
        percent,
        status,
    };
}

/**
 * Dynamically computes title, status, and progress percentage for a Task Map node
 * based on live sub-task states.
 */
export function getNodeDynamicStatusAndProgress(
    node: TaskMapNode,
    tasks: Task[]
): {
    title: string;
    status: 'todo' | 'in_progress' | 'completed';
    progress: number;
    subTask?: SubTask;
    task?: Task;
} {
    const task = tasks.find((t) => t._id === node.taskId);
    const liveSubTasks = task ? getSubTasksForTaskId(node.taskId, task.subTasks) : [];

    // Special case: Master Finish node across all 3 key tasks
    if (node.id === 'node-master-finish' || node.id === 'master-finish') {
        const keyTaskIds = [
            'task_russian_mastery_r7u2k',
            'task_ai_engineer_a8x4m',
            'task_mern_project_m3k9p',
        ];
        let grandCompleted = 0;
        let grandTotal = 0;

        keyTaskIds.forEach((tId) => {
            const matchTask = tasks.find((t) => t._id === tId);
            const subs = getSubTasksForTaskId(tId, matchTask?.subTasks);
            grandTotal += subs.length;
            grandCompleted += subs.filter((s) => s.status === 'completed').length;
        });

        const percent = grandTotal > 0 ? Math.round((grandCompleted / grandTotal) * 100) : (node.customProgress || 45);
        const status: 'todo' | 'in_progress' | 'completed' =
            percent === 100 ? 'completed' : percent > 0 ? 'in_progress' : 'todo';

        return {
            title: node.customTitle || '🏆 Grand Finish: Production AI Agent App & Multilingual Mastery',
            status,
            progress: percent,
            task,
        };
    }

    // 1. Direct subtask binding
    if (node.subTaskId) {
        const subTask = liveSubTasks.find((s) => s.id === node.subTaskId);
        if (subTask) {
            const status = subTask.status;
            let progress = 0;
            if (status === 'completed') progress = 100;
            else if (status === 'in_progress') progress = 50;
            else progress = 0;

            return {
                title: node.customTitle || subTask.title,
                status: (status as any) || 'todo',
                progress,
                subTask,
                task,
            };
        }
    }

    // 2. Node associated with a main task (aggregate progress of its subtasks)
    if (task && liveSubTasks.length > 0) {
        const completed = liveSubTasks.filter((s) => s.status === 'completed').length;
        const inProgress = liveSubTasks.filter((s) => s.status === 'in_progress').length;
        const percent = Math.round((completed / liveSubTasks.length) * 100);

        let status: 'todo' | 'in_progress' | 'completed' = 'todo';
        if (completed === liveSubTasks.length) {
            status = 'completed';
        } else if (completed > 0 || inProgress > 0) {
            status = 'in_progress';
        }

        return {
            title: node.customTitle || task.title,
            status,
            progress: percent,
            task,
        };
    }

    // Fallback to static node values
    return {
        title: node.customTitle || task?.title || 'Untitled Goal',
        status: node.customStatus || task?.status || 'todo',
        progress: node.customStatus === 'completed' ? 100 : node.customProgress || 0,
        task,
    };
}
