import React, { useState } from 'react';
import { X, ShieldCheck, Eye, EyeOff, Copy, Check, Download, Calendar, LogOut, User as UserIcon } from 'lucide-react';
import { User, MasterStreakStats } from '../../types';

interface AccountProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    stats: MasterStreakStats | null;
    onLogout: () => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
    isOpen,
    onClose,
    user,
    stats,
    onLogout,
}) => {
    const [isKeyRevealed, setIsKeyRevealed] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen || !user) return null;

    const recoveryKey = user.recoveryKey || 'VOW-9X4A-88KP-2Z1Q';

    const handleCopy = () => {
        navigator.clipboard.writeText(recoveryKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleDownloadFile = () => {
        const fileContent = `=====================================================
VOW WORKSPACE - PRIVATE ACCOUNT RECOVERY CREDENTIALS
=====================================================
Username:     ${user.username}
Display Name: ${user.name}
Recovery Key: ${recoveryKey}
Created At:   ${user.createdAt ? new Date(user.createdAt).toLocaleString() : new Date().toLocaleString()}

IMPORTANT PRIVACY & SECURITY NOTICE:
1. This Recovery Key is your master key to reset your password if forgotten.
2. Vow does not store plain emails or send recovery emails to protect your privacy.
3. Keep this file offline and safe (in your notes or password manager).
4. You can also view or re-download this file anytime inside the app by 
   clicking your user profile avatar in the sidebar or navbar.
=====================================================`;

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vow-account-${user.username}-recovery.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg neu-card p-6 sm:p-8 bg-[#E0E5EC] rounded-3xl border border-white/70 shadow-2xl relative space-y-6 text-left">
                {/* Close Cross Button on Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                    title="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header Title */}
                <div className="flex items-center space-x-3.5 pr-8">
                    <div className="w-12 h-12 rounded-2xl neu-button-primary flex items-center justify-center text-white shrink-0 shadow-md">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#549acb] block">
                            Account & Privacy Vault
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1a1c35] tracking-tight">
                            User Profile & Credentials
                        </h2>
                    </div>
                </div>
