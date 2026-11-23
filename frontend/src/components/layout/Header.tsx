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