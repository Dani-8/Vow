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