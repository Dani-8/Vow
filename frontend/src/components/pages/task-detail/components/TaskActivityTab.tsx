import React, { useState } from 'react';
import {
  Activity,
  MessageSquare,
  CheckCircle2,
  Paperclip,
  Clock,
  Sparkles,
  Send,
  AlertTriangle,
  Flame,
  FileText,
  Trash2,
  Target,
  TrendingUp,
  ShieldAlert,
  Tag
} from 'lucide-react';
import { TaskActivityItem } from '../../../../types';

interface TaskActivityTabProps {
  taskId: string;
  activities: TaskActivityItem[];
  onAddComment: (message: string, commentType?: string) => void;
  onDeleteActivity?: (activityId: string) => void;
}

export const TaskActivityTab: React.FC<TaskActivityTabProps> = ({
  taskId,
  activities,
  onAddComment,
  onDeleteActivity,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentCategory, setCommentCategory] = useState<'update' | 'blocker' | 'milestone'>('update');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(commentText.trim(), commentCategory);
    setCommentText('');
  };

  const getActivityIcon = (type: TaskActivityItem['type'], meta?: Record<string, any>) => {
    if (type === 'comment') {
      if (meta?.category === 'blocker') return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      if (meta?.category === 'milestone') return <Target className="w-4 h-4 text-emerald-600" />;
      return <TrendingUp className="w-4 h-4 text-indigo-600" />;
    }
