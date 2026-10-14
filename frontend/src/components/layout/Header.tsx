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
    onLogout: () => void;
    onBypassAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    user,
    activeView,
    onNavigateLanding,
    onOpenAuthModal,
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
