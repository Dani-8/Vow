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