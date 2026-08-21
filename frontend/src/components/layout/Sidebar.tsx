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
} from 'lucide-react';
import { User, MasterStreakStats, ActiveView } from '../../types';

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    activeView: ActiveView;
    onNavigate: (view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges') => void;
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
    id: 'home' | 'visible' | 'challenges' | 'task-map' | 'stats';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    activeViews: ActiveView[];
    activeClass: string;
    iconColor?: string;
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
        activeClass: 'neu-inset text-indigo-600 bg-indigo-50/50 shadow-inner',
        iconColor: 'text-indigo-600',
    },
    {
        id: 'task-map',
        label: 'Task Map',
        icon: Network,
        activeViews: ['task-map'],
        activeClass: 'neu-inset text-[#549acb]',
        iconColor: 'text-[#549acb]',
    },
    {
        id: 'stats',
        label: 'Analytics & Streaks',
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
                    <div className="flex items-center justify-between">
                        <div
                            onClick={() => onNavigate('home')}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                                <span className="font-black text-lg italic">V</span>
                            </div>
                            <div className="whitespace-nowrap overflow-hidden">
                                <h1 className="text-lg font-black text-[#1a1c35] tracking-tight">Vow App</h1>
                                <p className="text-[9px] font-bold text-[#717699] uppercase tracking-wider">Workspace</p>
                            </div>
                        </div>

                        <button
                            onClick={onToggleCollapse}
                            className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-[#717699] hover:text-[#549acb]"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <button
                    onClick={() => {
                        if (!user && onBypassAuth) {
                            onBypassAuth();
                        }
                        onOpenCreateModal();
                    }}
                    className={`w-full py-3 rounded-2xl neu-button-primary font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-300 ${
                        collapsed ? 'px-0' : 'px-4'
                    }`}
                    title="Create New Goal / Habit"
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span
                        className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                            collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[120px]'
                        }`}
                    >
                        New Goal
                    </span>
                </button>

                {/* Main Navigation */}
                <nav className="space-y-2 pt-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.activeViews.includes(activeView);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                    isActive
                                        ? item.activeClass
                                        : 'text-[#717699] hover:text-[#1a1c35] neu-button border-none bg-transparent shadow-none'
                                }`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${item.iconColor || ''}`} />
                                <span
                                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                        collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[150px]'
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    <button
                        onClick={() => {
                            if (!isPrivateUnlocked) {
                                onOpenPinModal();
                            } else {
                                onNavigate('private');
                            }
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                            activeView === 'private'
                                ? 'neu-inset text-purple-600'
                                : 'text-[#717699] hover:text-[#1a1c35] neu-button border-none bg-transparent shadow-none'
                        }`}
                    >
                        {isPrivateUnlocked ? (
                            <Unlock className="w-4 h-4 shrink-0 text-purple-600" />
                        ) : (
                            <Lock className="w-4 h-4 shrink-0 text-purple-500" />
                        )}
                        <div
                            className={`flex items-center justify-between flex-1 min-w-0 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[150px]'
                            }`}
                        >
                            <span className="truncate">Growth Vault</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded neu-inset font-bold text-purple-600 ml-2 shrink-0">
                                {isPrivateUnlocked ? 'OPEN' : 'PIN'}
                            </span>
                        </div>
                    </button>
                </nav>
            </div>

            <div className="space-y-4">
                {stats && (
                    <div
                        onClick={() => onNavigate('stats')}
                        className={`neu-inset rounded-2xl cursor-pointer hover:border-[#549acb] transition-all duration-300 overflow-hidden ${
                            collapsed ? 'opacity-0 max-h-0 p-0 m-0 pointer-events-none' : 'opacity-100 p-3 max-h-24'
                        }`}
                    >
                        <div className="flex items-center justify-between whitespace-nowrap">
                            <div className="min-w-0">
                                <span className="text-[10px] font-extrabold text-[#717699] uppercase block truncate">Master Streak</span>
                                <span className="text-sm font-black text-[#549acb]">{stats.masterStreak} Days</span>
                            </div>
                            <div className="w-8 h-8 rounded-full master-streak-ring flex items-center justify-center p-0.5 shrink-0">
                                <div className="w-full h-full rounded-full bg-[#E0E5EC] flex items-center justify-center font-bold text-xs text-[#44476A]">
                                    🔥
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-2 border-t border-white/40">
                    {user ? (
                        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} neu-inset p-2 rounded-2xl transition-all duration-300`}>
                            <div className="flex items-center space-x-2 min-w-0">
                                <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-[#549acb] font-bold shrink-0">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <div
                                    className={`min-w-0 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                        collapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[110px]'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-[#1a1c35] truncate">{user.name}</p>
                                    <p className="text-[10px] text-[#717699] truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className={`p-1.5 rounded-xl neu-button text-[#717699] hover:text-rose-600 transition-all duration-300 shrink-0 ${
                                    collapsed ? 'hidden opacity-0 max-w-0' : 'opacity-100'
                                }`}
                                title="Sign Out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <button
                                onClick={onOpenAuthModal}
                                className={`w-full py-2.5 rounded-xl neu-button text-[#549acb] font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-300 ${
                                    collapsed ? 'px-0' : 'px-3'
                                }`}
                            >
                                <LogIn className="w-4 h-4 shrink-0" />
                                <span
                                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                        collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[120px]'
                                    }`}
                                >
                                    Sign In / Demo
                                </span>
                            </button>

                            {onBypassAuth && (
                                <button
                                    onClick={onBypassAuth}
                                    className={`w-full py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 rounded-xl hover:bg-emerald-200/80 flex items-center justify-center space-x-1 transition-all duration-300 overflow-hidden ${
                                        collapsed ? 'opacity-0 max-h-0 p-0 m-0 pointer-events-none' : 'opacity-100 max-h-10'
                                    }`}
                                    title="Testing bypass: auto login demo account"
                                >
                                    <ShieldCheck className="w-3 h-3 shrink-0" />
                                    <span className="whitespace-nowrap">Instant Dev Bypass</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
