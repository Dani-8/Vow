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
                        {/* Category chips */}
                        <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-bold text-[#717699]">Type:</span>
                            <button
                                type="button"
                                onClick={() => setCommentCategory('update')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${commentCategory === 'update'
                                        ? 'neu-inset text-indigo-700 font-black'
                                        : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                                    }`}
                            >
                                Progress Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setCommentCategory('blocker')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${commentCategory === 'blocker'
                                        ? 'neu-inset text-rose-700 font-black'
                                        : 'neu-button text-[#717699] hover:text-rose-600'
                                    }`}
                            >
                                ⚠️ Blocker
                            </button>
                            <button
                                type="button"
                                onClick={() => setCommentCategory('milestone')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${commentCategory === 'milestone'
                                        ? 'neu-inset text-emerald-700 font-black'
                                        : 'neu-button text-[#717699] hover:text-emerald-600'
                                    }`}
                            >
                                🎯 Milestone
                            </button>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white flex items-center space-x-1.5 disabled:opacity-50 shadow-sm"
                        >
                            <span>Post Update</span>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Activity Timeline List */}
            <div className="neu-card p-6 bg-[#E0E5EC] space-y-6">
                <div className="flex items-center justify-between border-b border-[#c8d0e0]/70 pb-3">
                    <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-sm font-black text-[#1a1c35]">Audit Log &amp; Activity Stream</h3>
                    </div>
                    <span className="text-xs font-bold text-[#717699]">{activities.length} entries</span>
                </div>

                {activities.length > 0 ? (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#c8d0e0]">
                        {activities.map((item) => (
                            <div key={item.id} className="relative group">
                                {/* Timeline Dot / Icon */}
                                <div className="absolute -left-[27px] top-0 p-1.5 rounded-full neu-flat bg-[#E0E5EC] ring-4 ring-[#E0E5EC]">
                                    {getActivityIcon(item.type)}
                                </div>

                <div className="neu-card p-4 bg-[#E0E5EC] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-[#1a1c35]">
                        {item.user || 'Alex Rivera'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        • {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    {onDeleteActivity && (
                      <button
                        onClick={() => onDeleteActivity(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded neu-button text-slate-400 hover:text-rose-600 transition-all text-xs"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#2b2e4a] leading-relaxed font-medium">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-[#1a1c35]">No activity logged yet</p>
            <p className="text-[11px] text-slate-400">All check-ins, edits, and subtask completions will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};
