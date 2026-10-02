import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, MoreVertical, Lock, Unlock, Edit3, Trash2, Timer } from 'lucide-react';
import { Task } from '../../../../../../types';
import { StartFocusSessionModal } from '../../../../../modals/StartFocusSessionModal';
import { useFocusTimer } from '../../../../../../context/FocusTimerContext';

interface TaskCardMenuProps {
    task: Task;
    isStruggling: boolean;
    onOpenAIAssist: (task: Task) => void;
    onTogglePrivate: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
    task,
    isStruggling,
    onOpenAIAssist,
    onTogglePrivate,
    onEditTask,
    onDeleteTask,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { requestStartSession, activeSession } = useFocusTimer();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const isThisTaskActive = activeSession?.sourceType === 'task' && activeSession.sourceId === task._id;
