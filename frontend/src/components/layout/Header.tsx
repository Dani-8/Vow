import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { User, MasterStreakStats, ActiveView } from '../../types';

interface HeaderProps {
    user: User | null;
    stats: MasterStreakStats | null;
    activeView: ActiveView;
    onNavigateLanding?: () => void;
    onOpenAuthModal: () => void;
    onOpenProfileModal?: () => void;
    onLogout: () => void;
    onBypassAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    user,
    activeView,
    onNavigateLanding,
    onOpenAuthModal,
    onOpenProfileModal,
    onLogout,
    onBypassAuth,
}) => {
    const location = useLocation();

    const getViewTitle = () => {
        switch (activeView) {
            case 'home':
                return 'Home';
            case 'feed':
                return 'Mindset & Motivation Feed';
            case 'feed-post':
                return 'Community Post & Story';
            case 'visible':
                return 'Tasks & Habits';
            case 'private':
                return 'Growth Vault (PIN Safeguarded)';
            case 'stats':
                return 'Progress & Insights';
            case 'task-detail':
                return 'Task Workspace & Sub-Task Timeline';
            case 'task-map':
                if (location.pathname.startsWith('/app/map/') && location.pathname.length > '/app/map/'.length) {
                    return 'Task Map Canvas';
                }
                return 'Task Map';
            case 'challenges':
                return 'Challenges';
            case 'challenge-detail':
                return 'Challenge Workspace';
            default:
                if (location.pathname.startsWith('/app/challenges')) {
                    return location.pathname === '/app/challenges' ? 'Challenges' : 'Challenge Workspace';
                }
                return 'Home';
        }
    };

    return (
        <header className="neu-card px-4 sm:px-6 py-3.5 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 min-w-0">
                <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-lg sm:text-xl font-black text-[#1a1c35] truncate">{getViewTitle()}</h1>
                        <span className="hidden md:inline-flex text-[10px] px-2.5 py-0.5 rounded-full neu-badge text-[#549acb] font-bold border border-sky-200/50 uppercase tracking-wide shrink-0">
                            Vow Workspace
                        </span>
                    </div>
                    {activeView === 'feed' ? (
                        <p className="text-xs text-[#717699] font-medium truncate">
                            Community Motivation Vault • <span className="text-[#549acb] font-bold">Goal & Discipline Formulas</span> (No noise, pure drive)
                        </p>
                    ) : activeView === 'feed-post' ? (
                        <p className="text-xs text-[#717699] font-medium truncate">
                            Dedicated Story Workspace • <span className="text-[#549acb] font-bold">In-Depth Framework Breakdown</span>
                        </p>
                    ) : user ? (
                        <p className="text-xs text-[#717699] font-medium truncate">
                            Welcome back, <strong className="text-[#1a1c35] font-bold">{user.name}</strong> • Active Session
                        </p>
                    ) : (
                        <p className="text-xs text-[#717699] font-medium truncate">
                            Preview Mode • Public & Industry Workspace
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
                {onNavigateLanding && (
                    <button
                        onClick={onNavigateLanding}
                        className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-[#717699] hover:text-[#549acb]"
                    >
                        <span>Public Site</span>
                    </button>
                )}
                {onBypassAuth && !user && (
                    <button
                        onClick={onBypassAuth}
                        className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300/60 hover:bg-emerald-200"
                        title="Instant Dev Bypass for testing"
                    >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Dev Bypass</span>
                    </button>
                )}

                {user ? (
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={onOpenProfileModal}
                            className="neu-badge px-3 py-1.5 rounded-xl flex items-center space-x-2 hover:bg-white/60 transition-all cursor-pointer group"
                            title="Open Profile & Private Security Vault"
                        >
                            <div className="w-5 h-5 rounded-lg neu-inset flex items-center justify-center text-[#549acb] group-hover:scale-105 transition-transform">
                                <UserIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-[#44476A] max-w-[120px] truncate group-hover:text-[#549acb] transition-colors">{user.name}</span>
                        </button>
                        <button
                            onClick={onLogout}
                            className="neu-button p-2.5 rounded-xl text-[#717699] hover:text-rose-600 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (