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
    const { startSession, activeSession } = useFocusTimer();

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

    return (
        <div className="flex items-center space-x-1.5 shrink-0">
            {/* Quick Timer Launcher Button */}
            {!task.status || task.status !== 'completed' ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFocusModalOpen(true);
                    }}
                    className={`px-2 py-1.5 rounded-xl neu-button flex items-center space-x-1 text-xs font-bold transition-all ${isThisTaskActive
                        ? 'text-emerald-600 bg-emerald-50/80 border border-emerald-300'
                        : 'text-[#549acb] hover:bg-white/40'
                        }`}
                    title={isThisTaskActive ? 'Focus session actively running' : 'Start Focus Timer'}
                >
                    <Timer className={`w-3.5 h-3.5 ${isThisTaskActive ? 'text-emerald-500 animate-spin-slow' : 'text-[#549acb]'}`} />
                    <span className="hidden sm:inline">{isThisTaskActive ? 'Focusing' : 'Focus'}</span>
                </button>
            ) : null}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenAIAssist(task);
                }}
                className={`px-2.5 py-1.5 rounded-xl neu-button flex items-center space-x-1.5 text-xs font-bold transition-all ${isStruggling
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse border-none shadow-md'
                    : 'text-[#549acb] hover:bg-white/40'
                    }`}
                title="Ask Vow AI coach for micro-step breakdown or rescheduling"
            >
                <Sparkles className={`w-3.5 h-3.5 ${isStruggling ? 'text-white' : 'text-[#549acb]'}`} />
                <span className="hidden sm:inline">AI Help</span>
            </button>
