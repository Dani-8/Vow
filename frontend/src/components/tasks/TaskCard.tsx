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