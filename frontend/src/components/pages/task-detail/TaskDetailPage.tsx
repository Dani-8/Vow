import React, { useState, useEffect } from 'react';
import { Task, SubTask, TaskAttachment, TaskActivityItem, TaskStickyNote } from '../../../types';
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
    const [stickyNotes, setStickyNotes] = useState<TaskStickyNote[]>(() => getTaskStickyNotes(task._id));
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
        setStickyNotes(getTaskStickyNotes(task._id));
        setAttachments(getTaskAttachments(task._id));
        setActivities(getTaskActivities(task._id));
    }, [task._id]);

    // Listen for storage events for real-time synchronization
    useEffect(() => {
        const handleDetailUpdate = (e: Event) => {
            const custom = e as CustomEvent<{ taskId: string; updateType: string }>;
            if (custom.detail && custom.detail.taskId === task._id) {
                setStickyNotes(getTaskStickyNotes(task._id));
                setAttachments(getTaskAttachments(task._id));
                setActivities(getTaskActivities(task._id));
            }
        };

        window.addEventListener(TASK_DETAIL_UPDATED_EVENT, handleDetailUpdate);
        return () => {
            window.removeEventListener(TASK_DETAIL_UPDATED_EVENT, handleDetailUpdate);
        };
    }, [task._id]);

    // Handle sticky note creation
    const handleAddStickyNote = (noteData: Omit<TaskStickyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
        addTaskStickyNote(task._id, noteData);
        setStickyNotes(getTaskStickyNotes(task._id));
        setActivities(getTaskActivities(task._id));
    };

    // Handle sticky note update
    const handleUpdateStickyNote = (noteId: string, updates: Partial<Omit<TaskStickyNote, 'id' | 'createdAt'>>) => {
        updateTaskStickyNote(task._id, noteId, updates);
        setStickyNotes(getTaskStickyNotes(task._id));
    };

    // Handle sticky note deletion
    const handleDeleteStickyNote = (noteId: string) => {
        deleteTaskStickyNote(task._id, noteId);
        setStickyNotes(getTaskStickyNotes(task._id));
        setActivities(getTaskActivities(task._id));
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
                />
            )}

            {activeTab === 'sub-tasks' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all">
                    {/* Left / Main Column: Sub-Tasks Timeline */}
                    <div
                        className={`transition-all duration-300 ${activeSelectedSubTask ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl'
                            }`}
                    >
                        <SubTaskTimeline
                            subTasks={subTasks}
                            selectedSubTaskId={activeSelectedSubTask?.id || null}
                            onSelectSubTask={(st) => setSelectedSubTask(st)}
                            onToggleStatus={(id) => {
                                toggleSubTaskStatus(id);
                                const target = subTasks.find((s) => s.id === id);
                                if (target) {
                                    const willBeCompleted = target.status !== 'completed';
                                    addTaskActivity(task._id, {
                                        type: willBeCompleted ? 'subtask_complete' : 'status_change',
                                        message: willBeCompleted
                                            ? `Completed subtask: "${target.title}"`
                                            : `Reopened subtask: "${target.title}"`,
                                        user: 'Alex Rivera',
                                    });
                                    setActivities(getTaskActivities(task._id));
                                }
                            }}
                            onOpenAddModal={() => {
                                setEditingSubTask(null);
                                setIsAddModalOpen(true);
                            }}
                            onReorderSubTasks={reorderSubTasks}
                        />
                    </div>

                    {/* Right Column: Closeable Sub-Task Detail Panel */}
                    {activeSelectedSubTask && (
                        <div className="lg:col-span-5 sticky top-4">
                            <SubTaskDetailPanel
                                subTask={activeSelectedSubTask}
                                onClose={() => setSelectedSubTask(null)}
                                onToggleStatus={toggleSubTaskStatus}
                                onSetStatus={setSubTaskStatus}
                                onEdit={(st) => {
                                    setEditingSubTask(st);
                                    setIsAddModalOpen(true);
                                }}
                                onDelete={(id) => {
                                    deleteSubTask(id);
                                    setSelectedSubTask(null);
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'notes' && (
                <TaskNotesTab
                    taskId={task._id}
                    stickyNotes={stickyNotes}
                    onAddStickyNote={handleAddStickyNote}
                    onUpdateStickyNote={handleUpdateStickyNote}
                    onDeleteStickyNote={handleDeleteStickyNote}
                    onAddSubTask={(newSt) => {
                        addSubTask(newSt);
                        addTaskActivity(task._id, {
                            type: 'subtask_add',
                            message: `Imported subtask from sticky notes: "${newSt.title}"`,
                            user: 'Alex Rivera',
                        });
                        setActivities(getTaskActivities(task._id));
                    }}
                />
            )}

            {activeTab === 'files' && (
                <TaskFilesTab
                    taskId={task._id}
                    attachments={attachments}
                    onAddAttachment={handleAddAttachment}
                    onDeleteAttachment={handleDeleteAttachment}
                />
            )}

            {activeTab === 'activity' && (
                <TaskActivityTab
                    taskId={task._id}
                    activities={activities}
                    onAddComment={handleAddComment}
                    onDeleteActivity={handleDeleteActivity}
                />
            )}

            {/* Add / Edit Sub-Task Modal */}
            <AddSubTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(newSt) => {
                    addSubTask(newSt);
                    addTaskActivity(task._id, {
                        type: 'subtask_add',
                        message: `Added new subtask: "${newSt.title}"`,
                        user: 'Alex Rivera',
                    });
                    setActivities(getTaskActivities(task._id));
                }}
                editingSubTask={editingSubTask}
                onUpdate={updateSubTask}
            />
        </div>
    );
};
