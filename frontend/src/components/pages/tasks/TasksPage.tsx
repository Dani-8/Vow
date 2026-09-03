import React from 'react';
import { Unlock } from 'lucide-react';
import { Task } from '../../../types';
import { clearStoredPin } from '../../../api';
import { TaskControlsBar, FilterCategory } from './components/main/TaskControlsBar';
import { TaskGrid } from './components/main/TaskGrid';
import { LockedVaultCard } from '../../dashboard/LockedVaultCard';

interface TasksPageProps {
  tasks: Task[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  onToggleComplete: (task: Task) => void;
  onTogglePrivate: (task: Task) => void;
  onOpenAIAssist: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onCreateNewGoal: () => void;
  // Vault specific
  isVaultView?: boolean;
  isVaultUnlocked?: boolean;
  onOpenPinModal?: () => void;
  onLockVault?: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onToggleComplete,
  onTogglePrivate,
  onOpenAIAssist,
  onEditTask,
  onDeleteTask,
  onViewDetails,
  onCreateNewGoal,
  isVaultView = false,
  isVaultUnlocked = false,
  onOpenPinModal,
  onLockVault,
}) => {
  if (isVaultView && !isVaultUnlocked) {
    return <LockedVaultCard onEnterPin={onOpenPinModal || (() => {})} />;
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <TaskControlsBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      {/* Private Vault Badge */}
      {isVaultView && (
        <div className="neu-badge p-4 rounded-2xl flex items-center justify-between border border-purple-200">
          <div className="flex items-center space-x-3">
            <Unlock className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-extrabold text-[#1a1c35]">
                Growth Vault Unlocked
              </h3>
              <p className="text-xs text-[#717699]">
                Confidential personal habits and growth targets
              </p>
            </div>
          </div>
          {onLockVault && (
            <button
              onClick={onLockVault}
              className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-[#717699] hover:text-purple-600"
            >
              Lock Vault
            </button>
          )}
        </div>
      )}

      {/* Task Cards Grid */}
      <TaskGrid
        tasks={tasks}
        searchQuery={searchQuery}
        onToggleComplete={onToggleComplete}
        onTogglePrivate={onTogglePrivate}
        onOpenAIAssist={onOpenAIAssist}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onViewDetails={onViewDetails}
        onCreateNewGoal={onCreateNewGoal}
      />
    </div>
  );
};
