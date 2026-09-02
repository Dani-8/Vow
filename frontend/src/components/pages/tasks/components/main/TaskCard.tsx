import React from 'react';
import { Tag } from 'lucide-react';
import { Task } from '../../../../../types';
import { useTaskTimer } from '../../hooks/useTaskTimer';
import { TaskCardHeader } from './taskcardcomponents/TaskCardHeader';
import { TaskCardMenu } from './taskcardcomponents/TaskCardMenu';
import { TaskCardFooter } from './taskcardcomponents/TaskCardFooter';

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
