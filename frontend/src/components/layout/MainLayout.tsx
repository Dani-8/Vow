import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User, MasterStreakStats, ActiveView } from '../../types';

interface MainLayoutProps {
    user: User | null;
    stats: MasterStreakStats | null;
    activeView: ActiveView;
    sidebarCollapsed: boolean;
    onToggleSidebarCollapse: () => void;
    isPrivateUnlocked: boolean;
    onNavigate: (view: 'home' | 'feed' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail', param?: string) => void;
    onOpenCreateModal: () => void;
    onOpenAuthModal: () => void;
    onOpenPinModal: () => void;
    onLogout: () => void;
    onBypassAuth: () => void;
    children: React.ReactNode;
}