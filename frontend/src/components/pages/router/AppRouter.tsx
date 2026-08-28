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
import { ChallengesPage } from '../challenges/ChallengesPage';
import { ChallengeDetailPage } from '../challenges/ChallengeDetailPage';

import { ControlsBar, FilterCategory } from '../../dashboard/ControlsBar';
import { LockedVaultCard } from '../../dashboard/LockedVaultCard';
import { TaskGrid } from '../../dashboard/TaskGrid';
import { Challenge } from '../../../types';

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
  navigateToView: (view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail', param?: string) => void;
  setIsPrivateUnlocked: (unlocked: boolean) => void;
  onCheckInToday: () => void;
  onToggleComplete: (task: Task) => void;
  onTogglePrivate: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onOpenAIAssist: (task?: Task) => void;
  onOpenCreateModal: () => void;
  onOpenPinModal: () => void;
  challenges: Challenge[];
  selectedChallenge: Challenge | null;
  setSelectedChallenge: (challenge: Challenge | null) => void;
  onCreateChallenge: (data: Partial<Challenge>) => Promise<void>;
  onUpdateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
  onDeleteChallenge: (id: string) => Promise<void>;
  onLogChallengeDay: (
    id: string,
    logData: {
      dayNumber: number;
      date?: string;
      status?: 'completed' | 'rest' | 'missed';
      note?: string;
      timeSpent?: string;
    }
  ) => Promise<void>;
  onDeleteChallengeLog: (challengeId: string, logId: string) => Promise<void>;
  onStartNextSprint?: (
    challengeId: string,
    sprintData: {
      title: string;
      targetDays: number;
      startDate: string;
      targetEndDate?: string;
      rule?: string;
    }
  ) => Promise<void>;
  onCompleteSprint?: (
    challengeId: string,
    sprintId: string,
    retrospective: {
      completedAt: string;
      summary: string;
      score?: number;
      keyLearnings?: string;
    }
  ) => Promise<void>;
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
  challenges,
  selectedChallenge,
  setSelectedChallenge,
  onCreateChallenge,
  onUpdateChallenge,
  onDeleteChallenge,
  onLogChallengeDay,
  onDeleteChallengeLog,
  onStartNextSprint,
  onCompleteSprint,
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
        onBack={() => {
          if (selectedTaskForDetail?.isPrivate || currentTask.isPrivate) {
            navigate('/app/vault');
          } else {
            navigate('/app/tasks');
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
            navigate('/app/tasks');
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

  if (activeView === 'challenge-detail' || (selectedChallenge && activeView === 'challenges' && location.pathname.startsWith('/app/challenges/'))) {
    const challengeParam = decodeURIComponent(location.pathname.replace('/app/challenges/', ''));
    const currentChallenge =
      challenges.find(
        (c) =>
          (c.id && c.id.toLowerCase() === challengeParam.toLowerCase()) ||
          c._id === challengeParam ||
          (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === challengeParam.toLowerCase())
      ) ||
      selectedChallenge ||
      challenges[0];

    if (currentChallenge) {
      return (
        <ChallengeDetailPage
          challenge={currentChallenge}
          onBack={() => {
            setSelectedChallenge(null);
            navigateToView('challenges');
          }}
          onUpdateChallenge={onUpdateChallenge}
          onDeleteChallenge={onDeleteChallenge}
          onLogDay={onLogChallengeDay}
          onDeleteLog={onDeleteChallengeLog}
        />
      );
    }
  }

  if (activeView === 'challenges') {
    return (
      <ChallengesPage
        challenges={challenges}
        onSelectChallenge={(ch) => {
          setSelectedChallenge(ch);
          navigateToView('challenge-detail', ch.id || ch._id);
        }}
        onCreateChallenge={onCreateChallenge}
        onUpdateChallenge={onUpdateChallenge}
        onDeleteChallenge={onDeleteChallenge}
      />
    );
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
