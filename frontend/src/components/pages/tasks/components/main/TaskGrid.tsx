import React from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../../../../../types';
import { TaskCard } from './TaskCard';

interface TaskGridProps {
  tasks: Task[];
  searchQuery: string;
  onToggleComplete: (task: Task) => void;
  onTogglePrivate: (task: Task) => void;
  onOpenAIAssist: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onCreateNewGoal: () => void;
}