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
} from 'lucide-react';
import { Task } from '../../../../../../types';

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
    const menuRef = useRef<HTMLDivElement>(null);

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

    const getPriorityStyle = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-amber-100/80 text-amber-700 border-amber-200';
            case 'medium':
                return 'bg-blue-100/80 text-blue-700 border-blue-200';
            case 'low':
                return 'bg-emerald-100/80 text-emerald-700 border-emerald-200';
            default:
                return 'bg-amber-100/80 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="neu-card p-6 sm:p-8 space-y-6">
            {/* Action Row: Back Button & 3-Dot Menu */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="neu-button px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#54597d] hover:text-[#1a1c35] flex items-center space-x-2 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-[#549acb]" />
                    <span>Back</span>
                </button>

                {/* 3-Dot Action Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="neu-button w-10 h-10 rounded-2xl flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                        title="More options"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#E0E5EC] border border-white/80 shadow-2xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                            {/* Move to Growth Vault / Make Public */}
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onTogglePrivate?.(task);
                                }}
                                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/60 flex items-center space-x-2.5 transition-colors"
                            >
                                {task.isPrivate ? (
                                    <>
                                        <Unlock className="w-4 h-4 text-purple-600" />
                                        <span>Make Public</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4 text-purple-600" />
                                        <span>Move to Growth Vault</span>
                                    </>
                                )}
                            </button>

                            {/* Edit Task */}
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onEditTask?.(task);
                                }}
                                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/60 flex items-center space-x-2.5 transition-colors"
                            >
                                <Edit3 className="w-4 h-4 text-[#549acb]" />
                                <span>Edit Task</span>
                            </button>

                            <div className="my-1.5 border-t border-gray-300/40" />