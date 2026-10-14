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