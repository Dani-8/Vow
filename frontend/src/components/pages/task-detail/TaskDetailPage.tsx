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
            {activeTab === 'sub-tasks' ? (
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
                            onToggleStatus={toggleSubTaskStatus}
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
            ) : (
                /* Empty State Placeholder for Overview, Notes, Files, Activity */
                <EmptyTabPlaceholder tabName={activeTab} />
            )}

            {/* Add / Edit Sub-Task Modal */}
            <AddSubTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addSubTask}
                editingSubTask={editingSubTask}
                onUpdate={updateSubTask}
            />
        </div>
    );
};
