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