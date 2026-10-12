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
