import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2,
    Circle,
    Flame,
    Trophy,
    Clock,
    Sparkles,
    Lock,
    Unlock,
    Trash2,
    Edit3,
    Tag,
    Repeat,
    AlertCircle,
    MoreVertical,
} from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (task: Task) => void;
    onTogglePrivate: (task: Task) => void;
    onOpenAIAssist: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    onViewDetails?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onToggleComplete,
    onTogglePrivate,
    onOpenAIAssist,
    onEditTask,
    onDeleteTask,
    onViewDetails,
}) => {
    const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
    const [isStruggling, setIsStruggling] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown menu when clicking outside
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

    // Compute countdown timer for deadline
    useEffect(() => {
        if (!task.endTime) {
            setTimeLeftStr(null);
            setIsStruggling(false);
            return;
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const end = new Date(task.endTime!).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeftStr('Overdue');
                setIsStruggling(task.status !== 'completed');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const days = Math.floor(hours / 24);

                if (days > 0) {
                    setTimeLeftStr(`${days}d ${hours % 24}h left`);
                } else if (hours > 0) {
                    setTimeLeftStr(`${hours}h ${minutes}m left`);
                } else {
                    setTimeLeftStr(`${minutes}m left`);
                }

                // Mark struggling if deadline is under 4 hours and task is still pending
                setIsStruggling(diff < 4 * 60 * 60 * 1000 && task.status !== 'completed');
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 30000);
        return () => clearInterval(interval);
    }, [task.endTime, task.status]);

    const currentStreak = task.effectiveCurrentStreak ?? task.currentStreak ?? 0;
    const bestStreak = task.effectiveBestStreak ?? task.bestStreak ?? 0;
    const isCompleted = task.status === 'completed';

    return (
        <div
            className={`neu-card p-4 transition-all duration-300 relative group ${isCompleted
                ? 'opacity-85 bg-[#E0E5EC]/80 border-emerald-300/50'
                : isStruggling
                    ? 'border-amber-300/80 neu-glow-orange'
                    : ''
                }`}
        >
            {/* Top Header Row */}
            <div className="flex items-start justify-between gap-3 mb-2">
                {/* Completion Checkbox & Title Block */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <button
                        onClick={() => onToggleComplete(task)}
                        className={`mt-0.5 w-7 h-7 rounded-xl neu-button flex items-center justify-center shrink-0 transition-transform ${isCompleted
                            ? 'bg-emerald-500 text-white shadow-inner scale-105 border-emerald-500'
                            : 'text-[#717699] hover:text-[#549acb] hover:scale-110'
                            }`}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark complete today'}
                    >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-[#717699]" />}
                    </button>

                    {/* Clickable Title & Description Area */}
                    <div
                        onClick={() => onViewDetails && onViewDetails(task)}
                        className="flex-1 min-w-0 cursor-pointer hover:opacity-90 transition-opacity group/click"
                    >
                        <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                            <h3
                                className={`text-base font-bold text-[#1a1c35] group-hover/click:text-[#549acb] transition-colors break-words ${isCompleted ? 'line-through text-[#717699] font-normal' : ''
                                    }`}
                            >
                                {task.title}
                            </h3>

                            {task.isHabit && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-[#549acb] uppercase tracking-wide flex items-center space-x-1 shrink-0">
                                    <Repeat className="w-3 h-3 text-[#549acb]" />
                                    <span>Daily Habit</span>
                                </span>
                            )}

                            {task.isPrivate && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-purple-700 uppercase tracking-wide flex items-center space-x-1 shrink-0">
                                    <Lock className="w-3 h-3 text-purple-600" />
                                    <span>Growth Vault</span>
                                </span>
                            )}
                        </div>

                        {task.description && (
                            <p
                                className={`text-xs text-[#717699] mt-1 leading-snug line-clamp-2 break-words w-full ${isCompleted ? 'text-[#717699]/70' : ''
                                    }`}
                            >
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Controls: AI Help & 3-Dot Dropdown */}
                <div className="flex items-center space-x-1.5 shrink-0">
                    {/* AI Assist Button */}
                    <button
                        onClick={() => onOpenAIAssist(task)}
                        className={`px-2.5 py-1.5 rounded-xl neu-button flex items-center space-x-1.5 text-xs font-bold transition-all ${isStruggling
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse border-none shadow-md'
                            : 'text-[#549acb] hover:bg-white/40'
                            }`}
                        title="Ask Vow AI coach for micro-step breakdown or rescheduling"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${isStruggling ? 'text-white' : 'text-[#549acb]'}`} />
                        <span>AI Help</span>
                    </button>

                    {/* 3-Dot Dropdown Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] transition-colors"
                            title="More options"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-[#E0E5EC] border border-white/60 shadow-xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onTogglePrivate(task);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/50 flex items-center space-x-2 transition-colors"
                                >
                                    {task.isPrivate ? (
                                        <>
                                            <Unlock className="w-3.5 h-3.5 text-purple-600" />
                                            <span>Make Public</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3.5 h-3.5 text-purple-600" />
                                            <span>Move to Growth Vault</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onEditTask(task);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/50 flex items-center space-x-2 transition-colors"
                                >
                                    <Edit3 className="w-3.5 h-3.5 text-[#549acb]" />
                                    <span>Edit Task</span>
                                </button>

                                <div className="my-1 border-t border-gray-300/40" />

                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onDeleteTask(task);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/60 flex items-center space-x-2 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Delete Task</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 pl-10">
                    {task.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-bold text-[#717699] neu-inset bg-[#E0E5EC] px-2 py-0.5 rounded-lg flex items-center space-x-1 uppercase tracking-wider"
                        >
                            <Tag className="w-2.5 h-2.5 text-[#717699]" />
                            <span>{tag}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* Footer: Streaks & Time Remaining */}
            <div className="pt-3 border-t border-white/40 flex flex-wrap items-center justify-between gap-2">
                {/* Streak Badges (Non-Punitive Visuals) */}
                <div className="flex items-center space-x-3 text-xs">
                    {/* Current Streak */}
                    <div
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl neu-badge ${currentStreak > 0
                            ? 'text-[#549acb] bg-[#E0E5EC] font-bold border border-sky-200/50'
                            : 'text-[#717699] font-medium'
                            }`}
                    >
                        <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-[#549acb] fill-[#549acb]' : 'text-[#717699]'}`} />
                        <span>
                            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Current
                        </span>
                    </div>

                    {/* Best Streak (Permanently Celebrated) */}
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl neu-badge text-[#44476A] font-bold">
                        <Trophy className="w-3.5 h-3.5 text-[#549acb]" />
                        <span>Best: {bestStreak}d</span>
                    </div>

                    {/* Encouraging Non-punitive callout if current streak is 0 but record exists */}
                    {currentStreak === 0 && bestStreak > 0 && !isCompleted && (
                        <span className="text-[10px] font-bold text-[#549acb] neu-inset px-2 py-0.5 rounded-lg">
                            Beat record of {bestStreak}d!
                        </span>
                    )}
                </div>

                {/* Deadline countdown */}
                {timeLeftStr && (
                    <div
                        className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-xl neu-badge ${timeLeftStr === 'Overdue'
                            ? 'text-rose-700 bg-rose-50 border border-rose-200'
                            : isStruggling
                                ? 'text-amber-700 bg-amber-50 border border-amber-200'
                                : 'text-[#717699]'
                            }`}
                    >
                        {timeLeftStr === 'Overdue' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                            <Clock className="w-3.5 h-3.5 text-[#6D5DFC]" />
                        )}
                        <span>{timeLeftStr}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
