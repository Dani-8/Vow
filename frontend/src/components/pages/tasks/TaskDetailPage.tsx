import React, { useState, useEffect } from 'react';
import { Task, SubTask, TaskAttachment, TaskActivityItem, TaskStickyNote } from '../../../types';
import { TaskDetailHeader } from './components/detail/components/TaskDetailHeader';
import { TaskDetailTabs, TaskTabType } from './components/detail/components/TaskDetailTabs';
import { TaskOverviewTab } from './components/detail/components/TaskOverviewTab';
import { TaskNotesTab } from './components/detail/components/TaskNotesTab';
import { TaskFilesTab } from './components/detail/components/TaskFilesTab';
import { TaskActivityTab } from './components/detail/components/TaskActivityTab';
import { SubTaskTimeline } from './components/detail/subtasks/SubTaskTimeline';
import { SubTaskDetailPanel } from './components/detail/subtasks/SubTaskDetailPanel';
import { AddSubTaskModal } from './components/detail/subtasks/AddSubTaskModal';
import { useSubTasks } from './components/detail/hooks/useSubTasks';
import {
    getTaskStickyNotes,
    addTaskStickyNote,
    updateTaskStickyNote,
    deleteTaskStickyNote,
    getTaskAttachments,
    addTaskAttachment,
    deleteTaskAttachment,
    getTaskActivities,
    addTaskActivity,
    deleteTaskActivity,
    TASK_DETAIL_UPDATED_EVENT,
} from '../../../utils/taskDetailStorage';

interface TaskDetailPageProps {
    task: Task;
    onBack: () => void;
    onToggleComplete: (task: Task) => void;
    onTogglePrivate?: (task: Task) => void;
    onEditTask?: (task: Task) => void;
    onDeleteTask?: (task: Task) => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
    task,
    onBack,
    onToggleComplete,
    onTogglePrivate,
    onEditTask,
    onDeleteTask,
}) => {
    const [activeTab, setActiveTab] = useState<TaskTabType>('overview');
    const [selectedSubTask, setSelectedSubTask] = useState<SubTask | null>(null);

    // Detail States (Sticky Notes, Attachments, Activities)
    const [stickyNotes, setStickyNotes] = useState<TaskStickyNote[]>(() => getTaskStickyNotes(task._id, task.title));
    const [attachments, setAttachments] = useState<TaskAttachment[]>(() => getTaskAttachments(task._id, task.title));
    const [activities, setActivities] = useState<TaskActivityItem[]>(() => getTaskActivities(task._id, task.title));

    // Sub-task Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSubTask, setEditingSubTask] = useState<SubTask | null>(null);

    // Custom hook for sub-tasks logic
    const {
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
    } = useSubTasks(task._id, task.subTasks);

    // Sync task detail data when task changes
    useEffect(() => {
        setStickyNotes(getTaskStickyNotes(task._id, task.title));
        setAttachments(getTaskAttachments(task._id, task.title));
        setActivities(getTaskActivities(task._id, task.title));
    }, [task._id, task.title]);

    // Listen for storage events for real-time synchronization
    useEffect(() => {
        const handleDetailUpdate = (e: Event) => {
            const custom = e as CustomEvent<{ taskId: string; updateType: string }>;
            if (custom.detail && (custom.detail.taskId === task._id || !custom.detail.taskId)) {
                setStickyNotes(getTaskStickyNotes(task._id, task.title));
                setAttachments(getTaskAttachments(task._id, task.title));
                setActivities(getTaskActivities(task._id, task.title));
            }
        };

        window.addEventListener(TASK_DETAIL_UPDATED_EVENT, handleDetailUpdate);
        return () => {
            window.removeEventListener(TASK_DETAIL_UPDATED_EVENT, handleDetailUpdate);
        };
    }, [task._id, task.title]);