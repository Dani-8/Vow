import React from 'react';
import { Tag } from 'lucide-react';
import { Task } from '../../types';
import { useTaskTimer } from './hooks/useTaskTimer';
import { TaskCardHeader } from './components/TaskCardHeader';
import { TaskCardMenu } from './components/TaskCardMenu';
import { TaskCardFooter } from './components/TaskCardFooter';

export interface TaskCardProps {
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
    const { timeLeftStr, isStruggling } = useTaskTimer(task);

    const currentStreak = task.effectiveCurrentStreak ?? task.currentStreak ?? 0;
    const bestStreak = task.effectiveBestStreak ?? task.bestStreak ?? 0;
    const isCompleted = task.status === 'completed';

    return (
        <div
            onClick={() => onViewDetails && onViewDetails(task)}
            className={`neu-card p-4 transition-all duration-300 relative group cursor-pointer hover:shadow-md ${isCompleted
                    ? 'opacity-85 bg-[#E0E5EC]/80 border-emerald-300/50'
                    : isStruggling
                        ? 'border-amber-300/80 neu-glow-orange'
                        : ''
                }`}
        >
            <div className="flex items-start justify-between gap-3 mb-2">
                <TaskCardHeader
                    task={task}
                    isCompleted={isCompleted}
                    onToggleComplete={onToggleComplete}
                />
                <TaskCardMenu
                    task={task}
                    isStruggling={isStruggling}
                    onOpenAIAssist={onOpenAIAssist}
                    onTogglePrivate={onTogglePrivate}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                />
            </div>

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

            <TaskCardFooter
                currentStreak={currentStreak}
                bestStreak={bestStreak}
                isCompleted={isCompleted}
                timeLeftStr={timeLeftStr}
                isStruggling={isStruggling}
            />
        </div>
    );
};
