import React, { useState } from 'react';
import {
    Check,
    Plus,
    GripVertical,
    ChevronUp,
    ChevronDown,
    Filter,
} from 'lucide-react';
import { SubTask } from '../../../../../../types';

type FilterStatus = 'all' | 'in_progress' | 'completed' | 'pending';

interface SubTaskTimelineProps {
    subTasks: SubTask[];
    selectedSubTaskId: string | null;
    onSelectSubTask: (subTask: SubTask) => void;
    onOpenAddModal: () => void;
    onReorderSubTasks?: (newOrder: SubTask[]) => void;
    onToggleStatus?: (id: string) => void;
}

export const SubTaskTimeline: React.FC<SubTaskTimelineProps> = ({
    subTasks,
    selectedSubTaskId,
    onSelectSubTask,
    onOpenAddModal,
    onReorderSubTasks,
    onToggleStatus,
}) => {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Status counts
    const allCount = subTasks.length;
    const inProgressCount = subTasks.filter((st) => st.status === 'in_progress').length;
    const completedCount = subTasks.filter((st) => st.status === 'completed').length;
    const pendingCount = subTasks.filter((st) => st.status === 'pending').length;

    // Filtered list
    const filteredSubTasks = subTasks.filter((st) => {
        if (statusFilter === 'all') return true;
        return st.status === statusFilter;
    });

    // Reorder Handler (Move Up / Move Down)
    const handleMove = (indexInFullList: number, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onReorderSubTasks) return;

        const targetIndex = direction === 'up' ? indexInFullList - 1 : indexInFullList + 1;
        if (targetIndex < 0 || targetIndex >= subTasks.length) return;

        const updated = [...subTasks];
        const [moved] = updated.splice(indexInFullList, 1);
        updated.splice(targetIndex, 0, moved);
        onReorderSubTasks(updated);
    };

    // Drag and Drop Handlers
    const handleDragStart = (indexInFullList: number, e: React.DragEvent) => {
        setDraggedIndex(indexInFullList);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (indexInFullList: number, e: React.DragEvent) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== indexInFullList) {
            setDragOverIndex(indexInFullList);
        }
    };

    const handleDrop = (indexInFullList: number, e: React.DragEvent) => {
        e.preventDefault();
        if (draggedIndex === null || !onReorderSubTasks) return;

        if (draggedIndex !== indexInFullList) {
            const updated = [...subTasks];
            const [moved] = updated.splice(draggedIndex, 1);
            updated.splice(indexInFullList, 0, moved);
            onReorderSubTasks(updated);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 neu-card p-3 rounded-2xl">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#717699] px-2">
                    <Filter className="w-3.5 h-3.5 text-[#549acb]" />
                    <span>Filter:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {/* All */}
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'all'
                            ? 'neu-inset text-[#2563eb] bg-[#eef4f9]'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        All <span className="ml-1 opacity-75">({allCount})</span>
                    </button>

                    {/* In Progress */}
                    <button
                        onClick={() => setStatusFilter('in_progress')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'in_progress'
                            ? 'neu-inset text-blue-600 bg-blue-50'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        In Progress <span className="ml-1 opacity-75">({inProgressCount})</span>
                    </button>

                    {/* Completed */}
                    <button
                        onClick={() => setStatusFilter('completed')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'completed'
                            ? 'neu-inset text-emerald-600 bg-emerald-50'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Completed <span className="ml-1 opacity-75">({completedCount})</span>
                    </button>

                    {/* Pending */}
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'pending'
                            ? 'neu-inset text-purple-600 bg-purple-50'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Pending <span className="ml-1 opacity-75">({pendingCount})</span>
                    </button>
                </div>
            </div>

            {/* Timeline List */}
            <div className="relative pl-1 sm:pl-2 space-y-3">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[118px] sm:left-[134px] top-6 bottom-8 w-[2px] bg-[#cbd5e1] pointer-events-none" />

                {filteredSubTasks.length === 0 ? (
                    <div className="neu-card p-8 text-center text-xs font-bold text-[#717699]">
                        No sub-tasks found matching the selected filter.
                    </div>
                ) : (