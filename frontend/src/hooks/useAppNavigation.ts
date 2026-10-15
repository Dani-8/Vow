import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActiveView } from '../types';

export function useAppNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    // Map URL pathname to current ActiveView
    const getActiveViewFromPath = useCallback((path: string): ActiveView => {
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
    }, []);

    const activeView = getActiveViewFromPath(location.pathname);
