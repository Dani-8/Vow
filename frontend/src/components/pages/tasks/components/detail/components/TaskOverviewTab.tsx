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

            <button
              onClick={() => onToggleComplete(task)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center space-x-2 transition-all neu-button ${
                isCompleted
                  ? 'text-emerald-700 bg-emerald-500/15 hover:bg-emerald-500/25'
                  : 'text-slate-700 hover:text-[#1a1c35]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>

          {/* Description */}
          {task.description ? (
            <p className="text-sm font-medium text-[#4a4e69] leading-relaxed">
              {task.description}
            </p>
          ) : (
            <p className="text-sm italic text-slate-400">
              No description added yet. You can edit this task to add clear goals and requirements.
            </p>
          )}

          {/* Consequences of Skipping / Cost of Inaction Banner */}
          <RotatingConsequenceBanner
            consequences={task.consequencesOfSkipping}
            consequenceOfSkipping={task.consequenceOfSkipping}
            onEdit={onEditTask ? () => onEditTask(task) : undefined}
            title="Consequences of Skipping"
            badgeLabel="Cost of Inaction"
          />

          {/* Subtask Progress Bar */}
          <div className="pt-2 space-y-2 border-t border-[#c8d0e0]/70">
            <div className="flex items-center justify-between text-xs font-bold text-[#717699]">
              <div className="flex items-center space-x-1.5 text-[#1a1c35]">
                <ListTodo className="w-4 h-4 text-[#2563eb]" />
                <span className="font-black">Sub-task Breakdown</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{completedCount} of {totalCount} completed</span>
                <span className="text-[#2563eb] font-black">({progressPercent}%)</span>
              </div>
            </div>

            <div className="h-3 w-full neu-inset rounded-full overflow-hidden p-0.5 bg-[#d1d9e6]">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#2563eb] to-[#3b82f6]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => onTabChange('sub-tasks')}
                className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1"
              >
                <span>Manage &amp; Timeline Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Pinned Sticky Notes Board Preview */}
        <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl neu-button text-amber-600">
                <StickyNote className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1a1c35]">Sticky Notes &amp; Guidelines</h3>
                <span className="text-[11px] font-medium text-[#717699]">{stickyNotes.length} pinned paper notes</span>
              </div>
            </div>

            <button
              onClick={() => onTabChange('notes')}
              className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
            >
              <span>Open Sticky Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>