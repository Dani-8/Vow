import React from 'react';
import {
    X,
    Calendar,
    Clock,
    User as UserIcon,
    Flame,
    FileText,
    Download,
    CheckCircle,
    Edit2,
    Trash2,
    PlayCircle,
} from 'lucide-react';
import { SubTask } from '../../../../../../types';

interface SubTaskDetailPanelProps {
    subTask: SubTask;
    onClose: () => void;
    onToggleStatus: (id: string) => void;
    onSetStatus?: (id: string, status: SubTask['status']) => void;
    onEdit: (subTask: SubTask) => void;
    onDelete: (id: string) => void;
}

export const SubTaskDetailPanel: React.FC<SubTaskDetailPanelProps> = ({
    subTask,
    onClose,
    onToggleStatus,
    onSetStatus,
    onEdit,
    onDelete,
}) => {
    const isCompleted = subTask.status === 'completed';

    return (
        <div className="neu-card p-6 space-y-6 animate-fadeIn transition-all border border-blue-100/50">
            {/* Panel Header: Title & Close Button */}
            <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-extrabold text-[#1a1c35] tracking-tight leading-snug">
                    {subTask.title}
                </h3>
                <button
                    onClick={onClose}
                    className="neu-button w-9 h-9 rounded-2xl flex items-center justify-center text-[#717699] hover:text-[#1a1c35] flex-shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>