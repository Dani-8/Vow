import { useState, useEffect } from 'react';
import { SubTask } from '../../../../../../types';
import {
    getSubTasksForTaskId,
    saveSubTasksForTaskId,
    SUBTASKS_UPDATED_EVENT,
} from '../../../../../../utils/subtaskStorage';

export function useSubTasks(taskId: string, initialSubTasks?: SubTask[]) {
    const [subTasks, setSubTasks] = useState<SubTask[]>(() => {
        return getSubTasksForTaskId(taskId, initialSubTasks);
    });

    // Keep state in sync if taskId or initialSubTasks changes
    useEffect(() => {
        setSubTasks(getSubTasksForTaskId(taskId, initialSubTasks));
    }, [taskId]);

    // Listen for storage events from other components or tabs
    useEffect(() => {
        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<{ taskId: string; subTasks: SubTask[] }>;
            if (customEvent.detail && customEvent.detail.taskId === taskId) {
                setSubTasks(customEvent.detail.subTasks);
            }
        };

        window.addEventListener(SUBTASKS_UPDATED_EVENT, handleUpdate);
        return () => {
            window.removeEventListener(SUBTASKS_UPDATED_EVENT, handleUpdate);
        };
    }, [taskId]);

    // Persist and broadcast whenever subTasks change
    const saveAndSetSubTasks = (updated: SubTask[]) => {
        setSubTasks(updated);
        saveSubTasksForTaskId(taskId, updated);
    };

    const addSubTask = (newSubTask: Omit<SubTask, 'id' | 'taskId'>) => {
        const id = `st-${Date.now()}`;
        const subTaskWithIds: SubTask = {
            ...newSubTask,
            id,
            taskId,
        };
        const updated = [...subTasks, subTaskWithIds];
        saveAndSetSubTasks(updated);
        return subTaskWithIds;
    };

    const updateSubTask = (updatedItem: SubTask) => {
        const updated = subTasks.map((st) => (st.id === updatedItem.id ? updatedItem : st));
        saveAndSetSubTasks(updated);
    };

    const toggleSubTaskStatus = (id: string) => {
        const updated = subTasks.map((st) => {
            if (st.id === id) {
                const nextStatus: SubTask['status'] =
                    st.status === 'completed'
                        ? 'in_progress'
                        : st.status === 'in_progress'
                            ? 'completed'
                            : 'completed';
                return {
                    ...st,
                    status: nextStatus,
                    timeLeft: nextStatus === 'completed' ? 'Completed' : st.timeLeft || 'In progress',
                };
            }
            return st;
        });
        saveAndSetSubTasks(updated);
    };

    const setSubTaskStatus = (id: string, status: SubTask['status']) => {
        const updated = subTasks.map((st) => {
            if (st.id === id) {
                return {
                    ...st,
                    status,
                    timeLeft: status === 'completed' ? 'Completed' : st.timeLeft || 'In progress',
                };
            }
            return st;
        });
        saveAndSetSubTasks(updated);
    };

    const deleteSubTask = (id: string) => {
        const updated = subTasks.filter((st) => st.id !== id);
        saveAndSetSubTasks(updated);
    };

    const reorderSubTasks = (newOrder: SubTask[]) => {
        saveAndSetSubTasks(newOrder);
    };

    const completedCount = subTasks.filter((st) => st.status === 'completed').length;
    const totalCount = subTasks.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
        subTasks,
        addSubTask,
        updateSubTask,
        toggleSubTaskStatus,
        setSubTaskStatus,
        deleteSubTask,
        reorderSubTasks,
        completedCount,
        totalCount,
        progressPercent,
    };
}
