import React from 'react';
import {
    Activity,
    CheckCircle2,
    Paperclip,
    Flame,
    FileText,
    Trash2,
    Target,
    TrendingUp,
    ShieldAlert,
    AlertTriangle,
} from 'lucide-react';
import { TaskActivityItem } from '../../../../../../types';

interface TaskActivityItemRowProps {
    item: TaskActivityItem;
    onDeleteActivity?: (id: string) => void;
}

export const TaskActivityItemRow: React.FC<TaskActivityItemRowProps> = ({
    item,
    onDeleteActivity,
}) => {
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

    const renderCategoryBadge = () => {
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
        <div className="flex items-start space-x-3.5 group">
            <div className="p-2 rounded-xl neu-button shrink-0 mt-0.5 bg-[#E0E5EC]">
                {getActivityIcon(item.type, item.meta)}
            </div>

            <div className="flex-1 neu-card p-3.5 bg-[#E0E5EC] space-y-1.5 rounded-2xl border border-white/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-[#1a1c35]">
                            {item.authorName || 'System'}
                        </span>
                        {renderCategoryBadge()}
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 font-medium">
                            {formatTimestamp(item.timestamp)}
                        </span>
                        {onDeleteActivity && (
                            <button
                                onClick={() => onDeleteActivity(item.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-slate-400 hover:text-rose-600"
                                title="Delete entry"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-xs text-[#4a4e69] leading-relaxed font-medium">
                    {item.message}
                </p>
            </div>
        </div>
    );
};
