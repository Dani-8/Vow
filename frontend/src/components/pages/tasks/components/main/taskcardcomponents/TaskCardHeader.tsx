import React from 'react';
import { CheckCircle2, Circle, Repeat, Lock } from 'lucide-react';
import { Task } from '../../../../../../types';

interface TaskCardHeaderProps {
    task: Task;
    isCompleted: boolean;
    onToggleComplete: (task: Task) => void;
}