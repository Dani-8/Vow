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

import { useAppNavigation } from './useAppNavigation';

export function useTaskData() {
    const { activeView, navigateToView, location, navigate } = useAppNavigation();

    // If user has a token, initialize with clean empty states; otherwise null
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [privateTasks, setPrivateTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<MasterStreakStats | null>(null);

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
