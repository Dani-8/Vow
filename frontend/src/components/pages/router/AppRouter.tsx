import React from 'react';
import { Location, NavigateFunction } from 'react-router-dom';
import { Unlock } from 'lucide-react';
import { clearStoredPin } from '../../../api';
import { Task, User, MasterStreakStats, ActiveView } from '../../../types';

export const getTaskSlug = (task: Task): string => {
  const shortId = task._id ? task._id.replace(/^task_/, '').slice(-5) : '';
  if (!task.title) return task._id;
  const slug = task.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? (shortId ? `${slug}-${shortId}` : slug) : task._id;
};

import { TaskDetailPage } from '../task-detail/TaskDetailPage';
import { StatsView } from '../stats/StatsView';
import { HomeView } from '../home/HomeView';
import { TaskMapPage } from '../task-map/TaskMapPage';

import { ControlsBar, FilterCategory } from '../../dashboard/ControlsBar';
import { LockedVaultCard } from '../../dashboard/LockedVaultCard';
import { TaskGrid } from '../../dashboard/TaskGrid';

interface AppRouterProps {
  activeView: ActiveView;
  location: Location;
  user: User | null;
  tasks: Task[];
  privateTasks: Task[];
  filteredTasks: Task[];
  stats: MasterStreakStats | null;
  isPrivateUnlocked: boolean;
  selectedTaskForDetail: Task | null;
  setSelectedTaskForDetail: (task: Task | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: FilterCategory;
  setFilter: (filter: FilterCategory) => void;
  navigate: NavigateFunction;
  navigateToView: (view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map') => void;
  setIsPrivateUnlocked: (unlocked: boolean) => void;
  onCheckInToday: () => void;
  onToggleComplete: (task: Task) => void;
  onTogglePrivate: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onOpenAIAssist: (task?: Task) => void;
  onOpenCreateModal: () => void;
  onOpenPinModal: () => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  activeView,
  location,
  user,
  tasks,
  privateTasks,
  filteredTasks,
  stats,
  isPrivateUnlocked,
  selectedTaskForDetail,
  setSelectedTaskForDetail,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  navigate,
  navigateToView,
  setIsPrivateUnlocked,
  onCheckInToday,
  onToggleComplete,
  onTogglePrivate,
  onEditTask,
  onDeleteTask,
  onOpenAIAssist,
  onOpenCreateModal,
  onOpenPinModal,
}) => {
  if (activeView === 'task-detail') {
    const activeTaskParam = decodeURIComponent(location.pathname.replace('/app/task/', ''));
    const paramLower = activeTaskParam.toLowerCase();

    const allTasks = [...tasks, ...privateTasks];
    const currentTask =
      allTasks.find(
        (t) =>
          t._id === activeTaskParam ||
          getTaskSlug(t).toLowerCase() === paramLower ||
          t.title.toLowerCase() === paramLower ||
          t.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') === paramLower
      ) ||
      selectedTaskForDetail ||
      allTasks[0] || {
        _id: 'default',
        userId: user?.id || 'demo',
        title: 'Draft Q3 Personal Growth Blueprint',
        description:
          'Outline key milestones for skill acquisition and daily habit consistency for Q3.',
        tags: ['GROWTH', 'STRATEGY'],
        status: 'in_progress',
        priority: 'High',
        isPrivate: false,
        isHabit: false,
        currentStreak: 4,
        bestStreak: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

    return (
      <TaskDetailPage
        task={currentTask}
        onBack={() => {
          if (selectedTaskForDetail?.isPrivate || currentTask.isPrivate) {
            navigate('/app/vault');
          } else {
            navigate('/app');
          }
        }}
        onToggleComplete={onToggleComplete}
        onTogglePrivate={onTogglePrivate}
        onEditTask={onEditTask}
        onDeleteTask={(t) => {
          onDeleteTask(t);
          if (t.isPrivate) {
            navigate('/app/vault');
          } else {
            navigate('/app');
          }
        }}
      />
    );
  }

  if (activeView === 'home') {
    return (
      <HomeView
        tasks={tasks}
        stats={stats}
        onToggleComplete={onToggleComplete}
        onCheckInToday={onCheckInToday}
        onOpenCreateModal={onOpenCreateModal}
        onOpenAIAssist={onOpenAIAssist}
        onViewTaskDetail={(t) => {
          setSelectedTaskForDetail(t);
          navigate(`/app/task/${getTaskSlug(t)}`);
        }}
      />
    );
  }

  if (activeView === 'stats') {
    return <StatsView stats={stats} tasks={tasks} privateTasks={privateTasks} />;
  }

  if (activeView === 'task-map') {
    return <TaskMapPage tasks={[...tasks, ...privateTasks]} onBackToHome={() => navigateToView('home')} />;
  }

  if (activeView === 'private' && !isPrivateUnlocked) {
    return <LockedVaultCard onEnterPin={onOpenPinModal} />;
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <ControlsBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Private Vault Badge */}
      {activeView === 'private' && (
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
          <button
            onClick={() => {
              clearStoredPin();
              setIsPrivateUnlocked(false);
              navigateToView('visible');
            }}
            className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-[#717699] hover:text-purple-600"
          >
            Lock Vault
          </button>
        </div>
      )}

      {/* Task Cards Grid */}
      <TaskGrid
        tasks={filteredTasks}
        searchQuery={searchQuery}
        onToggleComplete={onToggleComplete}
        onTogglePrivate={(t) => onTogglePrivate(t)}
        onOpenAIAssist={onOpenAIAssist}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onViewDetails={(t) => {
          setSelectedTaskForDetail(t);
          navigate(`/app/task/${getTaskSlug(t)}`);
        }}
        onCreateNewGoal={onOpenCreateModal}
      />
    </div>
  );
};
