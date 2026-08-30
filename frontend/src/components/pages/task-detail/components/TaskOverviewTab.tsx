import React from 'react';
import {
    CheckCircle2,
    Clock,
    Flame,
    StickyNote,
    Paperclip,
    Activity,
    Tag,
    Calendar,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    ListTodo,
    Sparkles,
    ArrowUpRight,
    Pin
} from 'lucide-react';
import { Task, SubTask, TaskAttachment, TaskActivityItem, TaskStickyNote } from '../../../../types';
import { TaskTabType } from './TaskDetailTabs';

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
}) => {
    const isCompleted = task.status === 'completed';

