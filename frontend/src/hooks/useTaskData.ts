import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, getToken, getStoredPin, clearStoredPin, removeToken } from '../api';
import { Task, User, MasterStreakStats, SubTask } from '../types';
import { SUBTASKS_UPDATED_EVENT } from '../utils/subtaskStorage';
import {
  DEFAULT_DEMO_USER,
  DEFAULT_INITIAL_TASKS,
  DEFAULT_INITIAL_PRIVATE_TASKS,
  DEFAULT_INITIAL_STATS,
} from '../data/defaultInitialData';

export function useTaskData() {
  const navigate = useNavigate();
  const location = useLocation();

  // If user has a token, initialize with clean empty states; otherwise null
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [privateTasks, setPrivateTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<MasterStreakStats | null>(null);

  // Map URL pathname to active view
  const getActiveViewFromPath = (path: string): 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail' | 'task-map' => {
    if (path === '/auth') return 'auth';
    if (path === '/app/vault') return 'private';
    if (path === '/app/stats') return 'stats';
    if (path === '/app/tasks') return 'visible';
    if (path.startsWith('/app/map')) return 'task-map';
    if (path.startsWith('/app/task/')) return 'task-detail';
    if (path.startsWith('/app')) return 'home';
    return 'landing';
  };

  const activeView = getActiveViewFromPath(location.pathname);

  const navigateToView = (view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map', param?: string) => {
    switch (view) {
      case 'home':
        navigate('/app');
        break;
      case 'landing':
        navigate('/');
        break;
      case 'auth':
        navigate('/auth');
        break;
      case 'visible':
        navigate('/app/tasks');
        break;
      case 'private':
        navigate('/app/vault');
        break;
      case 'stats':
        navigate('/app/stats');
        break;
      case 'task-map':
        if (param) {
          navigate(`/app/map/${param}`);
        } else {
          navigate('/app/map');
        }
        break;
    }
  };

  const [filter, setFilter] = useState<'all' | 'habits' | 'tasks' | 'todo' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
          setTasks(tasksRes?.tasks || []);

          const statsRes = await api.getMasterStats();
          if (statsRes) setStats(statsRes);

          const storedPin = getStoredPin();
          if (storedPin) {
            try {
              const privRes = await api.getPrivateTasks(storedPin);
              setPrivateTasks(privRes?.tasks || []);
              setIsPrivateUnlocked(true);
            } catch (err) {
              clearStoredPin();
              setIsPrivateUnlocked(false);
            }
          }

          if (location.pathname === '/' || location.pathname === '') {
            navigate('/app', { replace: true });
          }
        } catch (err) {
          removeToken();
          // User session expired or invalid
          setUser(null);
          setTasks([]);
          setPrivateTasks([]);
          setStats(null);
        }
      } else {
        // Unauthenticated visitor
        setUser(null);
        setTasks([]);
        setPrivateTasks([]);
        setStats(null);
      }
    } catch (err: any) {
      console.warn('Initial data load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Listen to live subtasks updates to keep tasks state in sync everywhere
  useEffect(() => {
    const handleSubTasksUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ taskId: string; subTasks: SubTask[] }>;
      if (customEvent.detail && customEvent.detail.taskId) {
        const { taskId, subTasks } = customEvent.detail;
        setTasks((prevTasks) =>
          prevTasks.map((t) => {
            if (t._id === taskId) {
              const allDone = subTasks.length > 0 && subTasks.every((s) => s.status === 'completed');
              const anyActive = subTasks.some((s) => s.status === 'in_progress' || s.status === 'completed');
              return {
                ...t,
                subTasks,
                status: allDone ? 'completed' : anyActive ? 'in_progress' : t.status,
              };
            }
            return t;
          })
        );
        setPrivateTasks((prevPrivate) =>
          prevPrivate.map((t) => {
            if (t._id === taskId) {
              const allDone = subTasks.length > 0 && subTasks.every((s) => s.status === 'completed');
              const anyActive = subTasks.some((s) => s.status === 'in_progress' || s.status === 'completed');
              return {
                ...t,
                subTasks,
                status: allDone ? 'completed' : anyActive ? 'in_progress' : t.status,
              };
            }
            return t;
          })
        );
      }
    };

    window.addEventListener(SUBTASKS_UPDATED_EVENT, handleSubTasksUpdated);
    return () => {
      window.removeEventListener(SUBTASKS_UPDATED_EVENT, handleSubTasksUpdated);
    };
  }, []);

  const refreshData = async () => {
    if (!user) return;
    try {
      const tasksRes = await api.getTasks();
      setTasks(tasksRes.tasks || []);

      const statsRes = await api.getMasterStats();
      setStats(statsRes);

      if (isPrivateUnlocked) {
        const privRes = await api.getPrivateTasks();
        setPrivateTasks(privRes.tasks || []);
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
      setTasks(tasksRes.tasks || []);

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

  const handleCreateOrUpdateTask = async (
    taskData: {
      title: string;
      description?: string;
      tags?: string[];
      startTime?: string | null;
      endTime?: string | null;
      isPrivate?: boolean;
      isHabit?: boolean;
    },
    editingTaskId?: string | null
  ) => {
    if (!user) {
      navigateToView('auth');
      return;
    }

    if (editingTaskId) {
      await api.updateTask(editingTaskId, taskData);
    } else {
      await api.createTask(taskData);
    }
    await refreshData();
  };

  const handleToggleComplete = async (
    task: Task,
    onOptimisticUpdate?: (task: Task, newStatus: string) => void
  ) => {
    const isComp = task.status === 'completed';
    const newStatus = isComp ? 'in_progress' : 'completed';

    const updateTaskList = (list: Task[]) =>
      list.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t));

    setTasks(updateTaskList);
    setPrivateTasks(updateTaskList);
    if (onOptimisticUpdate) {
      onOptimisticUpdate(task, newStatus);
    }

    try {
      await api.toggleTaskComplete(task._id);
      refreshData();
    } catch (err: any) {
      const revertTaskList = (list: Task[]) =>
        list.map((t) => (t._id === task._id ? { ...t, status: task.status } : t));
      setTasks(revertTaskList);
      setPrivateTasks(revertTaskList);
      if (onOptimisticUpdate) {
        onOptimisticUpdate(task, task.status);
      }
      alert(err.message || 'Failed to update completion');
    }
  };

  const handleTogglePrivate = async (task: Task, onOpenPinModal?: () => void) => {
    if (!user?.hasPinSet || !isPrivateUnlocked) {
      onOpenPinModal?.();
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

  return {
    navigate,
    location,
    user,
    setUser,
    tasks,
    setTasks,
    privateTasks,
    setPrivateTasks,
    stats,
    activeView,
    navigateToView,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sidebarCollapsed,
    setSidebarCollapsed,
    isPrivateUnlocked,
    setIsPrivateUnlocked,
    loading,
    errorMsg,
    refreshData,
    handleBypassAuth,
    handleDirectCheckIn,
    handleLogout,
    handleCreateOrUpdateTask,
    handleToggleComplete,
    handleTogglePrivate,
    handleDeleteTask,
    filteredTasks,
  };
}
