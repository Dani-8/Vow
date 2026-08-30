import React, { useState, useEffect } from 'react';
import { Task, SubTask, TaskAttachment, TaskActivityItem } from '../../../types';
import { TaskDetailHeader } from './components/TaskDetailHeader';
import { TaskDetailTabs, TaskTabType } from './components/TaskDetailTabs';
import { TaskOverviewTab } from './components/TaskOverviewTab';
import { TaskNotesTab } from './components/TaskNotesTab';
import { TaskFilesTab } from './components/TaskFilesTab';
import { TaskActivityTab } from './components/TaskActivityTab';
import { SubTaskTimeline } from './subtasks/SubTaskTimeline';
import { SubTaskDetailPanel } from './subtasks/SubTaskDetailPanel';
import { AddSubTaskModal } from './subtasks/AddSubTaskModal';
import { useSubTasks } from './hooks/useSubTasks';
import {
    getTaskNote,
    saveTaskNote,
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

    // Detail States (Notes, Attachments, Activities)
    const [note, setNote] = useState<string>(() => getTaskNote(task._id));
    const [attachments, setAttachments] = useState<TaskAttachment[]>(() => getTaskAttachments(task._id));
    const [activities, setActivities] = useState<TaskActivityItem[]>(() => getTaskActivities(task._id));

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

    // Sync task detail data when taskId changes
    useEffect(() => {
        setNote(getTaskNote(task._id));
        setAttachments(getTaskAttachments(task._id));
        setActivities(getTaskActivities(task._id));
    }, [task._id]);

    // Listen for storage events for real-time synchronization
    useEffect(() => {
        const handleDetailUpdate = (e: Event) => {
            const custom = e as CustomEvent<{ taskId: string; updateType: string }>;
            if (custom.detail && custom.detail.taskId === task._id) {
                setNote(getTaskNote(task._id));
                setAttachments(getTaskAttachments(task._id));
                setActivities(getTaskActivities(task._id));
            }
        };

        window.addEventListener(TASK_DETAIL_UPDATED_EVENT, handleDetailUpdate);
        return () => {
            window.removeEventListener(TASK_DETAIL_UPDATED_EVENT, handleDetailUpdate);
        };
    }, [task._id]);

    // Handle note save
    const handleSaveNote = (newContent: string) => {
        setNote(newContent);
        saveTaskNote(task._id, newContent);
    };

    // Handle add attachment
    const handleAddAttachment = (attachmentData: Omit<TaskAttachment, 'id' | 'uploadedAt'>) => {
        const newAtt = addTaskAttachment(task._id, attachmentData);
        setAttachments(getTaskAttachments(task._id));
        setActivities(getTaskActivities(task._id));
    };

    // Handle delete attachment
    const handleDeleteAttachment = (attachmentId: string) => {
        deleteTaskAttachment(task._id, attachmentId);
        setAttachments(getTaskAttachments(task._id));
        setActivities(getTaskActivities(task._id));
    };

    // Handle manual comment / check-in
    const handleAddComment = (message: string, commentCategory?: string) => {
        addTaskActivity(task._id, {
            type: 'comment',
            message,
            user: 'Alex Rivera',
            meta: { category: commentCategory },
        });
        setActivities(getTaskActivities(task._id));
    };

    // Handle delete activity
    const handleDeleteActivity = (activityId: string) => {
        deleteTaskActivity(task._id, activityId);
        setActivities(getTaskActivities(task._id));
    };

    // Sync selected sub-task if updated in subTasks list
    const activeSelectedSubTask = selectedSubTask
        ? subTasks.find((st) => st.id === selectedSubTask.id) || null
        : null;

    return (
        <div className="space-y-6 w-full pb-10 animate-fadeIn">
            {/* 1. Header Section */}
            <TaskDetailHeader
                task={task}
                onBack={onBack}
                onToggleComplete={onToggleComplete}
                completedCount={completedCount}
                totalCount={totalCount}
                progressPercent={progressPercent}
                onTogglePrivate={onTogglePrivate}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
            />

            {/* 2. Navigation Tabs Bar */}
            <TaskDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />