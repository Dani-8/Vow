import React, { useState } from 'react';
import {
  Activity,
  MessageSquare,
  CheckCircle2,
  Paperclip,
  PlusCircle,
  Clock,
  Sparkles,
  Send,
  AlertTriangle,
  Flame,
  FileText,
  User,
  Trash2
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

    let prefix = '';
    if (commentCategory === 'blocker') prefix = '⚠️ Blocker: ';
    if (commentCategory === 'milestone') prefix = '🎯 Milestone: ';

    onAddComment(`${prefix}${commentText.trim()}`, commentCategory);
    setCommentText('');
  };

  const getActivityIcon = (type: TaskActivityItem['type']) => {
    switch (type) {
      case 'subtask_complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'attachment_add':
        return <Paperclip className="w-4 h-4 text-indigo-600" />;
      case 'note_update':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-violet-600" />;
      case 'status_change':
        return <Flame className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

