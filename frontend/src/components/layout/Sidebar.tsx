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

interface NavItemConfig {
    id: 'home' | 'feed' | 'visible' | 'challenges' | 'task-map' | 'stats';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    activeViews: ActiveView[];
    activeClass: string;
}

const NAV_ITEMS: NavItemConfig[] = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        activeViews: ['home'],
        activeClass: 'neu-inset text-[#549acb]',
    },
    {
        id: 'feed',
        label: 'Mindset Feed',
        icon: Sparkles,
        activeViews: ['feed'],
        activeClass: 'neu-inset text-[#549acb]',
    },
    {
        id: 'visible',
        label: 'Tasks & Habits',
        icon: CheckSquare,
        activeViews: ['visible', 'task-detail'],
        activeClass: 'neu-inset text-[#549acb]',
    },
    {
        id: 'challenges',
        label: 'Challenges',
        icon: Target,
        activeViews: ['challenges', 'challenge-detail'],
        activeClass: 'neu-inset text-[#549acb]',
    },
    {
        id: 'task-map',
        label: 'Task Map',
        icon: Network,
        activeViews: ['task-map'],
        activeClass: 'neu-inset text-[#549acb]',
    },
    {
        id: 'stats',
        label: 'Progress & Insights',
        icon: BarChart3,
        activeViews: ['stats'],
        activeClass: 'neu-inset text-[#549acb]',
    },
];

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed,
    onToggleCollapse,
    activeView,
    onNavigate,
    user,
    isPrivateUnlocked,
    stats,
    onOpenCreateModal,
    onOpenAuthModal,
    onOpenPinModal,
    onLogout,
    onBypassAuth,
}) => {
    return (
        <aside
            className={`neu-card flex flex-col justify-between py-6 transition-all duration-300 z-30 shrink-0 sticky top-4 h-[calc(100vh-2rem)] ${
                collapsed ? 'w-20 px-3' : 'w-64 px-5'
            }`}
        >
            <div className="space-y-6">
                {collapsed ? (
                    <div className="relative flex flex-col items-center py-1">
                        <div
                            onClick={() => onNavigate('home')}
                            className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-md hover:scale-105 transition-transform cursor-pointer shrink-0"
                        >
                            <span className="font-black text-lg italic">V</span>
                        </div>

                        <button
                            onClick={onToggleCollapse}
                            className="absolute -right-7 top-7 w-7 h-7 rounded-xl neu-button flex items-center justify-center text-[#717699] hover:text-[#549acb] bg-[#E0E5EC] z-10 shadow-md transition-all"
                            title="Expand sidebar"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (