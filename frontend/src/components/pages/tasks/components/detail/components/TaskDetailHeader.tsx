import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    MoreHorizontal,
    Tag,
    Flame,
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    PlayCircle,
    Lock,
    Unlock,
    Edit3,
    Trash2,
    Timer,
} from 'lucide-react';
import { Task } from '../../../../../../types';
import { StartFocusSessionModal } from '../../../../../modals/StartFocusSessionModal';
import { useFocusTimer } from '../../../../../../context/FocusTimerContext';

interface TaskDetailHeaderProps {
    task: Task;
    onBack: () => void;
    onToggleComplete: (task: Task) => void;
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    onTogglePrivate?: (task: Task) => void;
    onEditTask?: (task: Task) => void;
    onDeleteTask?: (task: Task) => void;
}

export const TaskDetailHeader: React.FC<TaskDetailHeaderProps> = ({
    task,
    onBack,
    onToggleComplete,
    completedCount,
    totalCount,
    progressPercent,
    onTogglePrivate,
    onEditTask,
    onDeleteTask,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { requestStartSession, activeSession } = useFocusTimer();
