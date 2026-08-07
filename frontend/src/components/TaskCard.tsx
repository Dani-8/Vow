import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (task: Task) => void;
    onTogglePrivate: (task: Task) => void;
    onOpenAIAssist: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onToggleComplete,
    onTogglePrivate,
    onOpenAIAssist,
    onEditTask,
    onDeleteTask,
}) => {
    const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
    const [isStruggling, setIsStruggling] = useState<boolean>(false);

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
            className={`neu-card p-6 transition-all duration-300 relative group ${isCompleted
                    ? 'opacity-85 bg-[#E0E5EC]/80 border-emerald-300/50'
                    : isStruggling
                        ? 'border-amber-300/80 neu-glow-orange'
                        : ''
                }`}
        >
            {/* Top Header Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                {/* Completion Checkbox & Title */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
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

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <h3
                                className={`text-lg font-bold text-[#1a1c35] truncate ${isCompleted ? 'line-through text-[#717699] font-normal' : ''
                                    }`}
                            >
                                {task.title}
                            </h3>

                            {task.isHabit && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-[#549acb] uppercase tracking-wide flex items-center space-x-1">
                                    <Repeat className="w-3 h-3 text-[#549acb]" />
                                    <span>Daily Habit</span>
                                </span>
                            )}

                            {task.isPrivate && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-purple-700 uppercase tracking-wide flex items-center space-x-1">
                                    <Lock className="w-3 h-3 text-purple-600" />
                                    <span>Growth Vault</span>
                                </span>
                            )}
                        </div>

                        {task.description && (
                            <p className={`text-xs text-[#717699] mt-1 line-clamp-2 ${isCompleted ? 'text-[#717699]/70' : ''}`}>
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Controls Menu */}
                <div className="flex items-center space-x-1 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                    {/* AI Assist Button */}
                    <button
                        onClick={() => onOpenAIAssist(task)}
                        className={`px-2.5 py-1.5 rounded-xl neu-button flex items-center space-x-1.5 text-xs font-bold ${isStruggling
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse border-none shadow-md'
                                : 'text-[#549acb] hover:bg-white/40'
                            }`}
                        title="Ask Vow AI coach for micro-step breakdown or rescheduling"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${isStruggling ? 'text-white' : 'text-[#549acb]'}`} />
                        <span className="hidden sm:inline">AI Help</span>
                    </button>

                    {/* Toggle Private Section */}
                    <button
                        onClick={() => onTogglePrivate(task)}
                        className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-purple-600"
                        title={task.isPrivate ? 'Move to Public Tasks' : 'Move to Growth Vault (Private)'}
                    >
                        {task.isPrivate ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-[#549acb]"
                        title="Edit Task"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => onDeleteTask(task)}
                        className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-rose-600"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
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
