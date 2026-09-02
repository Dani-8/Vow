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

            {/* Interactive Status Switcher & Priority Badge */}
            <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-[#717699] uppercase tracking-wider">
                    Status & Priority
                </label>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Status Buttons */}
                    <div className="flex items-center p-1 rounded-xl bg-slate-200/70 neu-inset text-xs font-bold gap-1">
                        <button
                            type="button"
                            onClick={() => onSetStatus ? onSetStatus(subTask.id, 'pending') : onToggleStatus(subTask.id)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${subTask.status === 'pending'
                                ? 'bg-purple-600 text-white shadow-xs font-black'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            type="button"
                            onClick={() => onSetStatus ? onSetStatus(subTask.id, 'in_progress') : onToggleStatus(subTask.id)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${subTask.status === 'in_progress'
                                ? 'bg-[#2563eb] text-white shadow-xs font-black'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            In Progress
                        </button>
                        <button
                            type="button"
                            onClick={() => onSetStatus ? onSetStatus(subTask.id, 'completed') : onToggleStatus(subTask.id)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${subTask.status === 'completed'
                                ? 'bg-emerald-600 text-white shadow-xs font-black'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            Completed
                        </button>
                    </div>

                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-100/80 border border-amber-200 flex items-center space-x-1.5 ml-auto">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        <span>{subTask.priority || 'High'}</span>
                    </span>
                </div>
            </div>