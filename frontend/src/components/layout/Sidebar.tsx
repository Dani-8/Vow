import React from 'react';
import {
    Home,
    CheckSquare,
    Lock,
    Unlock,
    BarChart3,
    Network,
    Target,
    Plus,
    ChevronLeft,
    ChevronRight,
    User as UserIcon,
    ShieldCheck,
    LogIn,
    LogOut,
    Flame,
    Sparkles,
} from 'lucide-react';
import { User, MasterStreakStats, ActiveView } from '../../types';

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    activeView: ActiveView;
    onNavigate: (view: 'home' | 'feed' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges') => void;
    user: User | null;
    isPrivateUnlocked: boolean;
    stats: MasterStreakStats | null;
    onOpenCreateModal: () => void;
    onOpenAuthModal: () => void;
    onOpenPinModal: () => void;
    onLogout: () => void;
    onBypassAuth?: () => void;
}