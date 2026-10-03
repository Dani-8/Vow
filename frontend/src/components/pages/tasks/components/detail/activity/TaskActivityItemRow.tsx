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
