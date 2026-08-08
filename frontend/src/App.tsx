import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Plus,
  Lock,
  Unlock,
  Flame,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { api, getToken, getStoredPin, clearStoredPin, removeToken } from './api';
import { Task, User, MasterStreakStats } from './types';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { MasterStreakBanner } from './components/MasterStreakBanner';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { TaskDetailPage } from './components/TaskDetailPage/TaskDetailPage';
import { PrivatePinModal } from './components/PrivatePinModal';
import { AIAssistModal } from './components/AIAssistModal';
import { AuthModal } from './components/AuthModal';
import { StatsView } from './components/StatsView';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [privateTasks, setPrivateTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<MasterStreakStats | null>(null);

  // Map URL pathname to active view
  const getActiveViewFromPath = (path: string): 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail' => {
    if (path === '/auth') return 'auth';
    if (path === '/app/vault') return 'private';
    if (path === '/app/stats') return 'stats';
    if (path.startsWith('/app/task/')) return 'task-detail';
    if (path.startsWith('/app')) return 'visible';
    return 'landing';
  };

  const activeView = getActiveViewFromPath(location.pathname);

  const navigateToView = (view: 'landing' | 'visible' | 'private' | 'stats' | 'auth') => {
    switch (view) {
      case 'landing':
        navigate('/');
        break;
      case 'auth':
        navigate('/auth');
        break;
      case 'visible':
        navigate('/app');
        break;
      case 'private':
        navigate('/app/vault');
        break;
      case 'stats':
        navigate('/app/stats');
        break;
    }
  };

  const [filter, setFilter] = useState<'all' | 'habits' | 'tasks' | 'todo' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedTaskForAI, setSelectedTaskForAI] = useState<Task | null>(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load initial auth & data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const token = getToken();
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);

          const tasksRes = await api.getTasks();
          setTasks(tasksRes.tasks);

          const statsRes = await api.getMasterStats();
          setStats(statsRes);

          const storedPin = getStoredPin();
          if (storedPin) {
            try {
              const privRes = await api.getPrivateTasks(storedPin);
              setPrivateTasks(privRes.tasks);
              setIsPrivateUnlocked(true);
            } catch (err) {
              clearStoredPin();
              setIsPrivateUnlocked(false);
            }
          }

          // If on root page and logged in, seamlessly enter workspace route /app
          if (location.pathname === '/' || location.pathname === '') {
            navigate('/app', { replace: true });
          }
        } catch (err) {
          removeToken();
          setUser(null);
          if (location.pathname.startsWith('/app')) {
            navigate('/', { replace: true });
          }
        }
      } else {
        setUser(null);
        // If unauthenticated trying to access app routes, send to /auth
        if (location.pathname.startsWith('/app')) {
          navigate('/auth', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setErrorMsg(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const refreshData = async () => {
    if (!user) return;
    try {
      const tasksRes = await api.getTasks();
      setTasks(tasksRes.tasks);

      const statsRes = await api.getMasterStats();
      setStats(statsRes);

      if (isPrivateUnlocked) {
        const privRes = await api.getPrivateTasks();
        setPrivateTasks(privRes.tasks);
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  const handleBypassAuth = async () => {
    try {
      setLoading(true);
      const res = await api.demoBypass();
      setUser(res.user);

      const tasksRes = await api.getTasks();
      setTasks(tasksRes.tasks);

      const statsRes = await api.getMasterStats();
      setStats(statsRes);

      navigateToView('visible');
    } catch (err: any) {
      alert(err.message || 'Bypass login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectCheckIn = async () => {
    try {
      const res = await api.checkInToday();
      setStats(res.stats);
      await refreshData();
    } catch (err: any) {
      console.error('Check-in failed:', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    clearStoredPin();
    setUser(null);
    setTasks([]);
    setPrivateTasks([]);
    setStats(null);
    setIsPrivateUnlocked(false);
    navigateToView('landing');
  };

  const handleCreateOrUpdateTask = async (taskData: {
    title: string;
    description?: string;
    tags?: string[];
    startTime?: string | null;
    endTime?: string | null;
    isPrivate?: boolean;
    isHabit?: boolean;
  }) => {
    if (!user) {
      await handleBypassAuth();
    }

    if (editingTask) {
      await api.updateTask(editingTask._id, taskData);
    } else {
      await api.createTask(taskData);
    }
    await refreshData();
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await api.toggleTaskComplete(task._id);
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update completion');
    }
  };

  const handleTogglePrivate = async (task: Task) => {
    if (!user?.hasPinSet || !isPrivateUnlocked) {
      setIsPinModalOpen(true);
      return;
    }
    try {
      await api.toggleTaskPrivate(task._id);
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to move task');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    try {
      await api.deleteTask(task._id);
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const handleOpenAIAssist = (task: Task) => {
    setSelectedTaskForAI(task);
    setIsAIAssistOpen(true);
  };

  // Filter tasks based on activeView, filter type, search query
  const rawList = activeView === 'private' ? privateTasks : tasks;

  const filteredTasks = rawList.filter((task) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTag = task.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    if (filter === 'habits') return task.isHabit;
    if (filter === 'tasks') return !task.isHabit;
    if (filter === 'todo') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';

    return true;
  });

  // Render standalone landing page (no sidebar or workspace header)
  if (activeView === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          if (!user) {
            handleBypassAuth();
          } else {
            navigateToView('visible');
          }
        }}
        onOpenAuth={() => navigateToView('auth')}
        onBypassAuth={handleBypassAuth}
      />
    );
  }

  // Render standalone auth page (no sidebar or workspace header)
  if (activeView === 'auth') {
    return (
      <AuthPage
        onSuccess={async (loggedUser) => {
          setUser(loggedUser);
          await refreshData();
          navigateToView('visible');
        }}
        onBypass={handleBypassAuth}
        onBackToHome={() => navigateToView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#44476A] flex w-full p-2 sm:p-4 gap-4">
      {/* Collapsible Sidebar Navigation for App Workspace */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'private' && !isPrivateUnlocked) {
            setIsPinModalOpen(true);
            navigateToView('private');
          } else {
            navigateToView(view);
          }
        }}
        user={user}
        isPrivateUnlocked={isPrivateUnlocked}
        stats={stats}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenAuthModal={() => navigateToView('auth')}
        onOpenPinModal={() => {
          setIsPinModalOpen(true);
          navigateToView('private');
        }}
        onLogout={handleLogout}
        onBypassAuth={handleBypassAuth}
      />

      {/* Main Content Area (Fluid Full Width) */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <Header
          user={user}
          stats={stats}
          activeView={activeView}
          onNavigateLanding={() => navigateToView('landing')}
          onOpenAuthModal={() => navigateToView('auth')}
          onLogout={handleLogout}
          onBypassAuth={handleBypassAuth}
        />

        {/* View Routing inside Workspace */}
        <main className="flex-1">
          {activeView === 'task-detail' ? (
            <TaskDetailPage
              task={
                selectedTaskForDetail ||
                tasks.find((t) => t._id === location.pathname.replace('/app/task/', '')) ||
                privateTasks.find((t) => t._id === location.pathname.replace('/app/task/', '')) || {
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
                }
              }
              onBack={() => {
                if (selectedTaskForDetail?.isPrivate) {
                  navigate('/app/vault');
                } else {
                  navigate('/app');
                }
              }}
              onToggleComplete={handleToggleComplete}
              onTogglePrivate={handleTogglePrivate}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={(t) => {
                handleDeleteTask(t._id);
                if (t.isPrivate) {
                  navigate('/app/vault');
                } else {
                  navigate('/app');
                }
              }}
            />
          ) : activeView === 'stats' ? (
            <StatsView stats={stats} tasks={tasks} privateTasks={privateTasks} />
          ) : activeView === 'private' && !isPrivateUnlocked ? (
            /* Locked Private Section Prompt */
            <div className="neu-card p-12 text-center max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl neu-button flex items-center justify-center text-purple-600 bg-purple-50 mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1a1c35]">Personal Growth Vault Locked</h3>
              <p className="text-xs text-[#717699] mt-2 leading-relaxed">
                This area is protected by your independent secondary PIN for private goals.
              </p>
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="mt-6 neu-button-primary px-6 py-2.5 rounded-xl text-sm font-bold"
              >
                Enter Vault PIN
              </button>
            </div>
          ) : (
            /* Main Dashboard View ('visible' or 'private') */
            <div className="space-y-6">
              {/* Master Streak Banner */}
              <MasterStreakBanner stats={stats} onCheckInToday={handleDirectCheckIn} />

              {/* Controls Bar: Search & Category Filters */}
              <div className="neu-card p-4 flex flex-wrap items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-[#717699] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search goals, habits, tags..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl neu-input text-sm font-medium"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center neu-inset p-1.5 rounded-2xl space-x-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${filter === 'all' ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699] hover:text-[#1a1c35]'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('habits')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${filter === 'habits' ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699] hover:text-[#1a1c35]'
                      }`}
                  >
                    Habits
                  </button>
                  <button
                    onClick={() => setFilter('tasks')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${filter === 'tasks' ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699] hover:text-[#1a1c35]'
                      }`}
                  >
                    Single Tasks
                  </button>
                  <button
                    onClick={() => setFilter('todo')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${filter === 'todo' ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699] hover:text-[#1a1c35]'
                      }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${filter === 'completed' ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699] hover:text-[#1a1c35]'
                      }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Private Area Status Badge */}
              {activeView === 'private' && (
                <div className="neu-badge p-4 rounded-2xl flex items-center justify-between border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Unlock className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="text-sm font-extrabold text-[#1a1c35]">Growth Vault Unlocked</h3>
                      <p className="text-xs text-[#717699]">Confidential personal habits and growth targets</p>
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

              {/* Task Cards List Grid */}
              {filteredTasks.length === 0 ? (
                <div className="neu-card p-12 text-center">
                  <p className="text-sm font-semibold text-[#717699]">
                    {searchQuery ? 'No goals match your search filter.' : 'No goals found in this section yet.'}
                  </p>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="mt-4 neu-button-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Goal Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onTogglePrivate={handleTogglePrivate}
                      onOpenAIAssist={handleOpenAIAssist}
                      onEditTask={(t) => {
                        setEditingTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      onDeleteTask={handleDeleteTask}
                      onViewDetails={(t) => {
                        setSelectedTaskForDetail(t);
                        navigate(`/app/task/${t._id}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        editingTask={editingTask}
        defaultIsPrivate={activeView === 'private'}
      />

      <PrivatePinModal
        isOpen={isPinModalOpen}
        hasPinSet={!!user?.hasPinSet}
        onClose={() => setIsPinModalOpen(false)}
        onSuccessUnlocked={async () => {
          setIsPrivateUnlocked(true);
          navigateToView('private');
          try {
            const privRes = await api.getPrivateTasks();
            setPrivateTasks(privRes.tasks);
          } catch (err) {
            console.error('Failed to load private tasks:', err);
          }
        }}
      />

      <AIAssistModal
        isOpen={isAIAssistOpen}
        task={selectedTaskForAI}
        onClose={() => setIsAIAssistOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAuth={async (loggedUser) => {
          setUser(loggedUser);
          await refreshData();
          navigateToView('visible');
        }}
      />
    </div>
  );
}
