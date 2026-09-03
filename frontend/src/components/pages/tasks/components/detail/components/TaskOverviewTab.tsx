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
import { Task, SubTask, TaskAttachment, TaskActivityItem, TaskStickyNote } from '../../../../../../types';
import { TaskTabType } from './TaskDetailTabs';
import { RotatingConsequenceBanner } from '../../../../../common/RotatingConsequenceBanner';

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
  const isCompleted = task.status === 'completed';

  // Priority color config
  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'High':
        return { label: 'High Priority', bg: 'bg-rose-500/10 text-rose-600 border-rose-200' };
      case 'Medium':
        return { label: 'Medium Priority', bg: 'bg-amber-500/10 text-amber-600 border-amber-200' };
      case 'Low':
        return { label: 'Low Priority', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
      default:
        return { label: 'Standard Priority', bg: 'bg-slate-500/10 text-slate-600 border-slate-200' };
    }
  };

  const priorityStyle = getPriorityBadge(task.priority);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      {/* Left / Main Column: Core Status, Progress & Scratchpad Preview */}
      <div className="lg:col-span-8 space-y-6">
        {/* 1. Status & Sub-tasks Progress Card */}
        <div className="neu-card p-6 bg-[#E0E5EC] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${priorityStyle.bg}`}>
                {priorityStyle.label}
              </span>
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                task.isHabit ? 'bg-indigo-500/10 text-indigo-600' : 'bg-blue-500/10 text-blue-600'
              }`}>
                {task.isHabit ? 'Daily Habit' : 'Milestone Task'}
              </span>
              {task.isPrivate && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700">
                  🔒 Private Vault
                </span>
              )}
            </div>