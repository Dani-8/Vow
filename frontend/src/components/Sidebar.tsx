import React from 'react';
import {
  Home,
  CheckSquare,
  Lock,
  Unlock,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Flame,
  Sparkles,
  ShieldCheck,
  LogIn,
  LogOut,
} from 'lucide-react';
import { User, MasterStreakStats } from '../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeView: 'landing' | 'visible' | 'private' | 'stats' | 'task-detail';
  onNavigate: (view: 'landing' | 'visible' | 'private' | 'stats') => void;
  user: User | null;
  isPrivateUnlocked: boolean;
  stats: MasterStreakStats | null;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  onOpenPinModal: () => void;
  onLogout: () => void;
  onBypassAuth?: () => void;
}

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
      {/* Top Header & Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate('visible')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <span className="font-black text-lg italic">V</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-black text-[#1a1c35] tracking-tight">Vow App</h1>
                <p className="text-[9px] font-bold text-[#717699] uppercase tracking-wider">Workspace</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-[#717699] hover:text-[#549acb]"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Create Goal Action */}
        <button
          onClick={() => {
            if (!user && onBypassAuth) {
              onBypassAuth();
            }
            onOpenCreateModal();
          }}
          className={`w-full py-3 rounded-2xl neu-button-primary font-bold text-xs flex items-center justify-center space-x-2 ${
            collapsed ? 'px-0' : 'px-4'
          }`}
          title="Create New Goal / Habit"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>New Goal</span>}
        </button>

        {/* Navigation Items */}
        <nav className="space-y-2 pt-2">
          {/* Tasks & Habits */}
          <button
            onClick={() => onNavigate('visible')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeView === 'visible' || activeView === 'task-detail'
                ? 'neu-inset text-[#549acb]'
                : 'text-[#717699] hover:text-[#1a1c35] neu-button border-none bg-transparent shadow-none'
            }`}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Tasks & Habits</span>}
          </button>

          {/* Private Vault */}
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
            {!collapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Growth Vault</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded neu-inset font-bold text-purple-600">
                  {isPrivateUnlocked ? 'OPEN' : 'PIN'}
                </span>
              </div>
            )}
          </button>

          {/* Analytics */}
          <button
            onClick={() => onNavigate('stats')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeView === 'stats'
                ? 'neu-inset text-[#549acb]'
                : 'text-[#717699] hover:text-[#1a1c35] neu-button border-none bg-transparent shadow-none'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Analytics & Streaks</span>}
          </button>
        </nav>
      </div>

      {/* Bottom Section: Master Streak Badge & Profile */}
      <div className="space-y-4">
        {/* Master Streak Mini Ring */}
        {stats && !collapsed && (
          <div
            onClick={() => onNavigate('stats')}
            className="neu-inset p-3 rounded-2xl cursor-pointer hover:border-[#549acb] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#717699] uppercase block">Master Streak</span>
                <span className="text-sm font-black text-[#549acb]">{stats.masterStreak} Days</span>
              </div>
              <div className="w-8 h-8 rounded-full master-streak-ring flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-[#E0E5EC] flex items-center justify-center font-bold text-xs text-[#44476A]">
                  🔥
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Card / Auth button */}
        <div className="pt-2 border-t border-white/40">
          {user ? (
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} neu-inset p-2 rounded-2xl`}>
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-[#549acb] font-bold shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1a1c35] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#717699] truncate">{user.email}</p>
                  </div>
                )}
              </div>
              {!collapsed && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-rose-600"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onOpenAuthModal}
                className={`w-full py-2.5 rounded-xl neu-button text-[#549acb] font-bold text-xs flex items-center justify-center space-x-2 ${
                  collapsed ? 'px-0' : 'px-3'
                }`}
              >
                <LogIn className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Sign In / Demo</span>}
              </button>

              {onBypassAuth && !collapsed && (
                <button
                  onClick={onBypassAuth}
                  className="w-full py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 rounded-xl hover:bg-emerald-200/80 flex items-center justify-center space-x-1"
                  title="Testing bypass: auto login demo account"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Instant Dev Bypass</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
