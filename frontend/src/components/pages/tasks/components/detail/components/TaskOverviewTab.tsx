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
