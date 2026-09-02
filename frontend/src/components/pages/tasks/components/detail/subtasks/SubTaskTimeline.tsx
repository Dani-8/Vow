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