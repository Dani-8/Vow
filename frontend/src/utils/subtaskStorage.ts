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

    // If initialSubTasks provided
    if (initialSubTasks && initialSubTasks.length > 0) {
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
    let task = tasks.find((t) => t._id === node.taskId);

    let liveSubTasks = task ? getSubTasksForTaskId(task._id, task.subTasks) : [];

    // If node has subTaskId but subtask not found in current task, search across all known tasks
    if (node.subTaskId && !liveSubTasks.some((s) => s.id === node.subTaskId)) {
        for (const cand of tasks) {
            const candSubs = getSubTasksForTaskId(cand._id, cand.subTasks);
            if (candSubs.some((s) => s.id === node.subTaskId)) {
                task = cand;
                liveSubTasks = candSubs;
                break;
            }
        }
    }

    // If node has explicit customStatus, prioritize it
    if (node.customStatus) {
        const explicitStatus = node.customStatus;
        const progress = explicitStatus === 'completed' ? 100 : explicitStatus === 'in_progress' ? 50 : 0;
        const subTask = liveSubTasks.find((s) => s.id === node.subTaskId) || task?.subTasks?.find((s) => s.id === node.subTaskId);
        return {
            title: node.customTitle || subTask?.title || task?.title || 'Milestone Step',
            status: explicitStatus,
            progress,
            subTask: subTask ? { ...subTask, status: explicitStatus === 'todo' ? 'pending' : (explicitStatus as any) } : undefined,
            task,
        };
    }

    // 1. Direct subtask binding
    if (node.subTaskId) {
        const subTask = liveSubTasks.find((s) => s.id === node.subTaskId) || task?.subTasks?.find((s) => s.id === node.subTaskId);
        if (subTask) {
            const subStatus = subTask.status;
            const normalizedStatus: 'todo' | 'in_progress' | 'completed' =
                subStatus === 'completed'
                    ? 'completed'
                    : subStatus === 'in_progress'
                        ? 'in_progress'
                        : 'todo';

            let progress = 0;
            if (normalizedStatus === 'completed') progress = 100;
            else if (normalizedStatus === 'in_progress') progress = 50;
            else progress = 0;

            // Also create a reconciled subTask with the normalized status
            const reconciledSubTask = {
                ...subTask,
                status: normalizedStatus === 'todo' ? 'pending' : (normalizedStatus as any),
            };

            return {
                title: node.customTitle || subTask.title,
                status: normalizedStatus,
                progress,
                subTask: reconciledSubTask,
                task,
            };
        }

        // Even if specific subTask not found in live array, return custom attributes
        return {
            title: node.customTitle || 'Milestone Step',
            status: node.customStatus || 'todo',
            progress: node.customStatus === 'completed' ? 100 : node.customStatus === 'in_progress' ? 50 : node.customProgress || 0,
            task,
        };
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
        status: node.customStatus || (task?.status as any) || 'todo',
        progress: node.customStatus === 'completed' ? 100 : node.customProgress || 0,
        task,
    };
}
