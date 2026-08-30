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

    switch (type) {
      case 'subtask_complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'attachment_add':
        return <Paperclip className="w-4 h-4 text-indigo-600" />;
      case 'note_update':
        return <FileText className="w-4 h-4 text-blue-600" />;
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

  // Helper to render clean category chip badge without raw emojis
  const renderCategoryBadge = (item: TaskActivityItem) => {
    const category = item.meta?.category;
    if (!category && item.type !== 'comment') return null;

    if (category === 'blocker') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>Blocker</span>
        </span>
      );
    }

    if (category === 'milestone') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
          <Target className="w-3 h-3 text-emerald-600" />
          <span>Milestone</span>
        </span>
      );
    }

    if (category === 'update') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-black uppercase tracking-wider">
          <TrendingUp className="w-3 h-3 text-indigo-600" />
          <span>Progress Update</span>
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Post Check-in / Comment Box */}
      <div className="neu-card p-5 bg-[#E0E5EC] space-y-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-black text-[#1a1c35]">Log Check-in &amp; Progress Note</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share a status update, highlight a blocker, or record a key milestone reached..."
            rows={3}
            className="w-full p-3 rounded-xl neu-inset bg-[#dbe2ee]/60 text-xs font-medium text-[#1a1c35] focus:outline-none placeholder:text-slate-400 resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Category chips with clean Lucide SVG icons */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#717699]">Type:</span>
              <button
                type="button"
                onClick={() => setCommentCategory('update')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  commentCategory === 'update'
                    ? 'neu-inset text-indigo-700 font-black'
                    : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Progress Update</span>
              </button>
              <button
                type="button"
                onClick={() => setCommentCategory('blocker')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  commentCategory === 'blocker'
                    ? 'neu-inset text-rose-700 font-black'
                    : 'neu-button text-[#717699] hover:text-rose-600'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Blocker</span>
              </button>
              <button
                type="button"
                onClick={() => setCommentCategory('milestone')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  commentCategory === 'milestone'
                    ? 'neu-inset text-emerald-700 font-black'
                    : 'neu-button text-[#717699] hover:text-emerald-600'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Milestone</span>
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white flex items-center space-x-1.5 disabled:opacity-50 shadow-sm"
            >
