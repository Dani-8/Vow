import { useState, useEffect } from 'react';
import { SubTask } from '../../../../types';

// Default sub-tasks matching the "Draft Q3 Personal Growth Blueprint" reference
const DEFAULT_SUB_TASKS: SubTask[] = [
    {
        id: 'st-1',
        taskId: 'default',
        title: 'Define main 3 goals',
        description: 'Identify the top 3 high-impact personal growth targets for Q3.',
        dateLabel: 'Aug 14',
        dueDate: 'Aug 14, 2026',
        timeLeft: 'Completed',
        status: 'completed',
        priority: 'High',
        assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
        masterStreak: '4 Days',
    },
    {
        id: 'st-2',
        taskId: 'default',
        title: 'Research & References',
        description: 'Gather books, articles, and learning paths for skill acquisition.',
        dateLabel: 'Aug 15',
        dueDate: 'Aug 15, 2026',
        timeLeft: 'Completed',
        status: 'completed',
        priority: 'Medium',
        assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
        masterStreak: '4 Days',
    },
    {
        id: 'st-3',
        taskId: 'default',
        title: 'Create milestone timeline',
        description: 'Create a detailed milestone timeline for Q3 including key learning, habit building, and review checkpoints.',
        dateLabel: 'Aug 17',
        dueDate: 'Aug 17, 2026',
        timeLeft: 'Today',
        status: 'in_progress',
        priority: 'High',
        assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
        masterStreak: '4 Days',
        attachments: [
            { name: 'roadmap.pdf', size: '1.2 MB', type: 'application/pdf' },
        ],
    },
    {
        id: 'st-4',
        taskId: 'default',
        title: 'Break down daily habits',
        description: 'Translate milestones into 15-minute daily trackable routines.',
        dateLabel: 'Aug 19',
        dueDate: 'Aug 19, 2026',
        timeLeft: '2 Days Left',
        status: 'pending',
        priority: 'Medium',
        assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
        masterStreak: '4 Days',
    },
    {
        id: 'st-5',
        taskId: 'default',
        title: 'Final review & polish',
        description: 'Conduct final review with mentor and publish blueprint in vault.',
        dateLabel: 'Aug 20',
        dueDate: 'Aug 20, 2026',
        timeLeft: '3 Days Left',
        status: 'pending',
        priority: 'Low',
        assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
        masterStreak: '4 Days',
    },
];

export function useSubTasks(taskId: string) {
    const storageKey = `vow_subtasks_${taskId}`;

    const [subTasks, setSubTasks] = useState<SubTask[]>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // fallback
        }
        // Return defaults mapped to this taskId
        return DEFAULT_SUB_TASKS.map((st) => ({ ...st, taskId }));
    });

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(subTasks));
        } catch (e) {
            console.error('Failed to save subtasks to local storage', e);
        }
    }, [subTasks, storageKey]);

    const addSubTask = (newSubTask: Omit<SubTask, 'id' | 'taskId'>) => {
        const id = `st-${Date.now()}`;
        const subTaskWithIds: SubTask = {
            ...newSubTask,
            id,
            taskId,
        };
        setSubTasks((prev) => [...prev, subTaskWithIds]);
        return subTaskWithIds;
    };

    const updateSubTask = (updated: SubTask) => {
        setSubTasks((prev) => prev.map((st) => (st.id === updated.id ? updated : st)));
    };

    const toggleSubTaskStatus = (id: string) => {
        setSubTasks((prev) =>
            prev.map((st) => {
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
                        timeLeft: nextStatus === 'completed' ? 'Completed' : st.timeLeft,
                    };
                }
                return st;
            })
        );
    };

    const deleteSubTask = (id: string) => {
        setSubTasks((prev) => prev.filter((st) => st.id !== id));
    };

    const reorderSubTasks = (newOrder: SubTask[]) => {
        setSubTasks(newOrder);
    };

    const completedCount = subTasks.filter((st) => st.status === 'completed').length;
    const totalCount = subTasks.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
        subTasks,
        addSubTask,
        updateSubTask,
        toggleSubTaskStatus,
        deleteSubTask,
        reorderSubTasks,
        completedCount,
        totalCount,
        progressPercent,
    };
}
