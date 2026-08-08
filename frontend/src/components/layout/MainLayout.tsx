import React from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { User, MasterStreakStats } from '../../types';

interface MainLayoutProps {
    user: User | null;
    stats: MasterStreakStats | null;
    activeView: 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail';
    sidebarCollapsed: boolean;
    onToggleSidebarCollapse: () => void;
    isPrivateUnlocked: boolean;
    onNavigate: (view: 'landing' | 'visible' | 'private' | 'stats' | 'auth') => void;
    onOpenCreateModal: () => void;
    onOpenAuthModal: () => void;
    onOpenPinModal: () => void;
    onLogout: () => void;
    onBypassAuth: () => void;
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    user,
    stats,
    activeView,
    sidebarCollapsed,
    onToggleSidebarCollapse,
    isPrivateUnlocked,
    onNavigate,
    onOpenCreateModal,
    onOpenAuthModal,
    onOpenPinModal,
    onLogout,
    onBypassAuth,
    children,
}) => {
    return (
        <div className="min-h-screen bg-[#E0E5EC] text-[#44476A] flex w-full p-2 sm:p-4 gap-4">
            {/* Sidebar Navigation */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={onToggleSidebarCollapse}
                activeView={activeView}
                onNavigate={onNavigate}
                user={user}
                isPrivateUnlocked={isPrivateUnlocked}
                stats={stats}
                onOpenCreateModal={onOpenCreateModal}
                onOpenAuthModal={onOpenAuthModal}
                onOpenPinModal={onOpenPinModal}
                onLogout={onLogout}
                onBypassAuth={onBypassAuth}
            />

            {/* Main Content Column */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Header Bar */}
                <Header
                    user={user}
                    stats={stats}
                    activeView={activeView}
                    onNavigateLanding={() => onNavigate('landing')}
                    onOpenAuthModal={onOpenAuthModal}
                    onLogout={onLogout}
                    onBypassAuth={onBypassAuth}
                />

                {/* View Router Workspace Content */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};
