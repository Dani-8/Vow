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
import { Task } from '../../../../types';

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

                            {/* Delete Task */}
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    if (
                                        window.confirm(
                                            `Are you sure you want to delete "${task.title}"?`
                                        )
                                    ) {
                                        onDeleteTask?.(task);
                                    }
                                }}
                                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/70 flex items-center space-x-2.5 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                                <span>Delete Task</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Title & Progress Ring Layout */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Side: Completion Circle + Title + Badges */}
                <div className="space-y-4 flex-1">
                    <div className="flex items-start space-x-4">
                        {/* Completion Toggle Circle */}
                        <button
                            onClick={() => onToggleComplete(task)}
                            className="mt-1 flex-shrink-0 focus:outline-none transition-transform active:scale-95"
                            title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                            {task.status === 'completed' ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-emerald-100" />
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-[#549acb] hover:bg-blue-50/50 flex items-center justify-center transition-all">
                                    <Circle className="w-6 h-6 text-transparent" />
                                </div>
                            )}
                        </button>

                        {/* Title & Tags */}
                        <div className="space-y-3">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c35] tracking-tight leading-tight">
                                {task.title || 'Draft Q3 Personal Growth Blueprint'}
                            </h1>

                            {/* Tags & Priority Row */}
                            <div className="flex flex-wrap items-center gap-2">
                                {task.tags && task.tags.length > 0 ? (
                                    task.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#549acb] bg-[#eef4f9] border border-blue-100/60 shadow-sm flex items-center space-x-1"
                                        >
                                            <Tag className="w-3 h-3" />
                                            <span>{tag}</span>
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#549acb] bg-[#eef4f9] border border-blue-100/60 flex items-center space-x-1">
                                            <Tag className="w-3 h-3" />
                                            <span>GROWTH</span>
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#549acb] bg-[#eef4f9] border border-blue-100/60 flex items-center space-x-1">
                                            <Tag className="w-3 h-3" />
                                            <span>STRATEGY</span>
                                        </span>
                                    </>
                                )}

                                <span
                                    className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border flex items-center space-x-1 ${getPriorityStyle(
                                        task.priority || 'High'
                                    )}`}
                                >
                                    <Flame className="w-3 h-3" />
                                    <span>{task.priority || 'High'}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#54597d] leading-relaxed max-w-2xl font-medium pt-1">
                        {task.description ||
                            'Outline key milestones for skill acquisition and daily habit consistency for Q3.'}
                    </p>

                    {/* Info Pills Row */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {/* Due Date Pill */}
                        <div className="neu-button px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#1a1c35]">
                            <Calendar className="w-4 h-4 text-[#549acb]" />
                            <span>Due: Aug 20, 2026</span>
                        </div>

                        {/* Time Left Pill */}
                        <div className="neu-button px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#1a1c35]">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>Time Left: 1h 34m</span>
                        </div>

                        {/* Status Pill */}
                        <div className="neu-button px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#1a1c35]">
                            <PlayCircle className="w-4 h-4 text-blue-500" />
                            <span>
                                Status:{' '}
                                {task.status === 'completed'
                                    ? 'Completed'
                                    : task.status === 'in_progress'
                                        ? 'In Progress'
                                        : 'In Progress'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Circular Progress Ring */}
                <div className="flex flex-col items-center justify-center neu-card p-6 min-w-[160px] self-start">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="stroke-[#d1d9e6]"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            {/* Progress Ring Gradient / Color */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="stroke-[#2563eb] transition-all duration-700 ease-out"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        </svg>

                        {/* Percentage Text Center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-[#1a1c35]">
                                {progressPercent}%
                            </span>
                        </div>
                    </div>

                    <div className="mt-2 text-xs font-bold text-[#717699]">
                        {completedCount} / {totalCount}
                    </div>
                </div>
            </div>
        </div>
    );
};
