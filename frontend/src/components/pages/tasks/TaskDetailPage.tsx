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

    // Handle sticky note creation
    const handleAddStickyNote = (noteData: Omit<TaskStickyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
        addTaskStickyNote(task._id, noteData);
        setStickyNotes(getTaskStickyNotes(task._id, task.title));
        setActivities(getTaskActivities(task._id, task.title));
    };

    // Handle sticky note update
    const handleUpdateStickyNote = (noteId: string, updates: Partial<Omit<TaskStickyNote, 'id' | 'createdAt'>>) => {
        updateTaskStickyNote(task._id, noteId, updates);
        setStickyNotes(getTaskStickyNotes(task._id, task.title));
    };

    // Handle sticky note deletion
    const handleDeleteStickyNote = (noteId: string) => {
        deleteTaskStickyNote(task._id, noteId);
        setStickyNotes(getTaskStickyNotes(task._id, task.title));
        setActivities(getTaskActivities(task._id, task.title));
    };

    // Handle add attachment
    const handleAddAttachment = (attachmentData: Omit<TaskAttachment, 'id' | 'uploadedAt'>) => {
        addTaskAttachment(task._id, attachmentData);
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

            {/* 3. Main Tab Content Workspace */}
            {activeTab === 'overview' && (
                <TaskOverviewTab
                    task={task}
                    subTasks={subTasks}
                    stickyNotes={stickyNotes}
                    attachments={attachments}
                    activities={activities}
                    completedCount={completedCount}
                    totalCount={totalCount}
                    progressPercent={progressPercent}
                    onTabChange={setActiveTab}
                    onToggleComplete={onToggleComplete}
                    onEditTask={onEditTask}
                />
            )}