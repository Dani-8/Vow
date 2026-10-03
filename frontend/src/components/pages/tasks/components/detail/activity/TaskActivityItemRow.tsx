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
