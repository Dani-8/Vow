import React from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import { TaskCard } from '../TaskCard';

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

export const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  searchQuery,
  onToggleComplete,
  onTogglePrivate,
  onOpenAIAssist,
  onEditTask,
  onDeleteTask,
  onViewDetails,
  onCreateNewGoal,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="neu-card p-12 text-center">
        <p className="text-sm font-semibold text-[#717699]">
          {searchQuery
            ? 'No goals match your search filter.'
            : 'No goals found in this section yet.'}
        </p>
        <button
          onClick={onCreateNewGoal}
          className="mt-4 neu-button-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Goal Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onTogglePrivate={onTogglePrivate}
          onOpenAIAssist={onOpenAIAssist}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
