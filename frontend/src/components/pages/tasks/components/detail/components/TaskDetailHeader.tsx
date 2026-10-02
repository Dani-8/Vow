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

    // Close dropdown menu on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // SVG circle calculations for progress ring
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    const getPriorityStyle = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-rose-100/80 text-rose-700 border-rose-200';
            case 'medium':
                return 'bg-blue-100/80 text-blue-700 border-blue-200';
            case 'low':
                return 'bg-emerald-100/80 text-emerald-700 border-emerald-200';
            default:
                return 'bg-amber-100/80 text-amber-700 border-amber-200';
        }
    };

    const isThisTaskActive = activeSession?.sourceType === 'task' && activeSession.sourceId === task._id;

    return (
        <div className="neu-card p-6 sm:p-8 space-y-6">
            {/* Action Row: Back Button, Quick Focus Button & 3-Dot Menu */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="neu-button px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#54597d] hover:text-[#1a1c35] flex items-center space-x-2 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-[#549acb]" />
                    <span>Back</span>
                </button>

                <div className="flex items-center space-x-2">
                    {/* Launch Focus Timer from Detail Page */}
                    {task.status !== 'completed' && (
                        <button
                            onClick={() => setIsFocusModalOpen(true)}
                            className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center space-x-1.5 transition-all ${isThisTaskActive
                                    ? 'neu-button bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm'
                                    : 'neu-button-primary text-white hover:scale-105 shadow-md'
                                }`}
                        >
                            <Timer className={`w-4 h-4 ${isThisTaskActive ? 'animate-spin-slow text-emerald-600' : 'text-white'}`} />
                            <span>{isThisTaskActive ? 'Focus Running' : 'Start Focus Timer'}</span>
                        </button>
                    )}
