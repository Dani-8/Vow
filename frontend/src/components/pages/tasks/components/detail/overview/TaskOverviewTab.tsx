import React from 'react';
import { Task, SubTask, TaskAttachment, TaskActivityItem, TaskStickyNote } from '../../../../../../types';
import { TaskTabType } from '../components/TaskDetailTabs';
import { TaskCoreStatusCard } from './TaskCoreStatusCard';
import { TaskStickyNotesPreview } from './TaskStickyNotesPreview';
import { TaskFilesPreview } from './TaskFilesPreview';
import { TaskAttributesCard } from './TaskAttributesCard';
import { TaskRecentActivityPreview } from './TaskRecentActivityPreview';

interface TaskOverviewTabProps {
    task: Task;
    subTasks: SubTask[];
    stickyNotes: TaskStickyNote[];
    attachments: TaskAttachment[];
    activities: TaskActivityItem[];
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    onTabChange: (tab: TaskTabType) => void;
    onToggleComplete: (task: Task) => void;
    onEditTask?: (task: Task) => void;
}

export const TaskOverviewTab: React.FC<TaskOverviewTabProps> = ({
    task,
    subTasks,
    stickyNotes,
    attachments,
    activities,
    completedCount,
    totalCount,
    progressPercent,
    onTabChange,
    onToggleComplete,
    onEditTask,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            {/* Left / Main Column: Core Status, Progress & Previews */}
            <div className="lg:col-span-8 space-y-6">
                <TaskCoreStatusCard
                    task={task}
                    completedCount={completedCount}
                    totalCount={totalCount}
                    progressPercent={progressPercent}
                    onToggleComplete={onToggleComplete}
                    onEditTask={onEditTask}
                    onTabChange={onTabChange}
                />

                <TaskStickyNotesPreview
                    stickyNotes={stickyNotes}
                    onTabChange={onTabChange}
                />

                <TaskFilesPreview
                    attachments={attachments}
                    onTabChange={onTabChange}
                />
            </div>

            {/* Right Column: Metadata & Recent Audit Trail */}
            <div className="lg:col-span-4 space-y-6">
                <TaskAttributesCard task={task} />
                <TaskRecentActivityPreview
                    activities={activities}
                    onTabChange={onTabChange}
                />
            </div>
        </div>
    );
};
