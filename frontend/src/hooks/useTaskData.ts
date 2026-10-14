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
    const getActiveViewFromPath = (path: string): 'home' | 'feed' | 'feed-post' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail' | 'task-map' | 'challenges' | 'challenge-detail' => {
        if (path === '/auth') return 'auth';
        if (path === '/app/vault') return 'private';
        if (path === '/app/stats') return 'stats';
        if (path.startsWith('/app/feed/') && path !== '/app/feed') return 'feed-post';
        if (path === '/app/feed' || path.startsWith('/app/feed')) return 'feed';
        if (path === '/app/tasks') return 'visible';
        if (path.startsWith('/app/map')) return 'task-map';
        if (path.startsWith('/app/challenges/') && path !== '/app/challenges') return 'challenge-detail';
        if (path === '/app/challenges' || path.startsWith('/app/challenges')) return 'challenges';
        if (path.startsWith('/app/task/')) return 'task-detail';
        if (path.startsWith('/app')) return 'home';
        return 'landing';
    };
