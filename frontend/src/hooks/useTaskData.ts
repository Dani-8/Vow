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
    const getActiveViewFromPath = (path: string): 'home' | 'feed' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail' | 'task-map' | 'challenges' | 'challenge-detail' => {
        if (path === '/auth') return 'auth';
        if (path === '/app/vault') return 'private';
        if (path === '/app/stats') return 'stats';
        if (path === '/app/feed') return 'feed';
        if (path === '/app/tasks') return 'visible';
        if (path.startsWith('/app/map')) return 'task-map';
        if (path.startsWith('/app/challenges/') && path !== '/app/challenges') return 'challenge-detail';
        if (path === '/app/challenges' || path.startsWith('/app/challenges')) return 'challenges';
        if (path.startsWith('/app/task/')) return 'task-detail';
        if (path.startsWith('/app')) return 'home';
        return 'landing';
    };

    const activeView = getActiveViewFromPath(location.pathname);

    const navigateToView = (view: 'home' | 'feed' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail', param?: string) => {
        switch (view) {
            case 'home':
                navigate('/app');
                break;
            case 'feed':
                navigate('/app/feed');
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
            case 'challenges':
                navigate('/app/challenges');
                break;
            case 'challenge-detail':
                if (param) {
                    navigate(`/app/challenges/${param}`);
                } else {
                    navigate('/app/challenges');
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