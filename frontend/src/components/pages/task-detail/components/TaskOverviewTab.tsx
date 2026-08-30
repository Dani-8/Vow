import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  FileText,
  Paperclip,
  Activity,
  Tag,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ListTodo,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Task, SubTask, TaskAttachment, TaskActivityItem } from '../../../../types';
import { TaskTabType } from './TaskDetailTabs';

interface TaskOverviewTabProps {
  task: Task;
  subTasks: SubTask[];
  note: string;
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
  note,
  attachments,
  activities,
  completedCount,
  totalCount,
  progressPercent,
  onTabChange,
  onToggleComplete,
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
