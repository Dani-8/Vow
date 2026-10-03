import React from 'react';
import { CheckCircle2, ListTodo, ChevronRight } from 'lucide-react';
import { Task } from '../../../../../../types';
import { RotatingConsequenceBanner } from '../../../../../common/RotatingConsequenceBanner';
import { TaskTabType } from '../components/TaskDetailTabs';

interface TaskCoreStatusCardProps {
    task: Task;
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    onToggleComplete: (task: Task) => void;
    onEditTask?: (task: Task) => void;
    onTabChange: (tab: TaskTabType) => void;
}

export const TaskCoreStatusCard: React.FC<TaskCoreStatusCardProps> = ({
    task,
    completedCount,
    totalCount,
    progressPercent,
    onToggleComplete,
    onEditTask,
    onTabChange,
}) => {
    const isCompleted = task.status === 'completed';

    const getPriorityBadge = (priority?: string) => {
        switch (priority) {
            case 'High':
                return { label: 'High Priority', bg: 'bg-rose-500/10 text-rose-600 border-rose-200' };
            case 'Medium':
                return { label: 'Medium Priority', bg: 'bg-amber-500/10 text-amber-600 border-amber-200' };
            case 'Low':
                return { label: 'Low Priority', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
            default:
                return { label: 'Standard Priority', bg: 'bg-slate-500/10 text-slate-600 border-slate-200' };
        }
    };

    const priorityStyle = getPriorityBadge(task.priority);
