import React from 'react';
import { Sparkles, Menu, ShieldCheck, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { User, MasterStreakStats } from '../types';

interface HeaderProps {
  user: User | null;
  stats: MasterStreakStats | null;
  activeView: 'landing' | 'visible' | 'private' | 'stats';
  onNavigateLanding?: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onBypassAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  stats,
  activeView,
  onNavigateLanding,
  onOpenAuthModal,
  onLogout,
  onBypassAuth,
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'visible':
        return 'Dashboard & Active Goals';
      case 'private':
        return 'Growth Vault (PIN Safeguarded)';
      case 'stats':
        return 'Analytics & Streak Records';
      default:
        return 'Dashboard';
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
          {user ? (
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

      {/* Right Actions & Auth indicator */}
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
            <div className="neu-badge px-3 py-1.5 rounded-xl flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-[#549acb]" />
              <span className="text-xs font-bold text-[#44476A] max-w-[120px] truncate">{user.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="neu-button p-2.5 rounded-xl text-[#717699] hover:text-rose-600"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="neu-button-primary px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
