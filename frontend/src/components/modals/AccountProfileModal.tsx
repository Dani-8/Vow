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

                {/* User Identity Card */}
                <div className="neu-inset p-4 rounded-2xl bg-white/45 border border-white/60">
                    <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl neu-inset bg-gradient-to-tr from-sky-500/25 to-purple-500/25 flex items-center justify-center font-black text-base text-[#1a1c35] border border-white/70 shrink-0">
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base font-black text-[#1a1c35] truncate">{user.name}</h3>
                            <p className="text-xs font-bold text-[#549acb] truncate">@{user.username}</p>
                            <span className="text-[10px] font-semibold text-[#717699] flex items-center space-x-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                <span>
                                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Private Security & Key Vault Section */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#515777] flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Private Recovery Key</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                            className="text-[11px] font-black text-[#549acb] hover:text-[#3d84b5] flex items-center space-x-1 transition-colors"
                        >
                            {isKeyRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{isKeyRevealed ? 'Hide' : 'Reveal Key'}</span>
                        </button>
                    </div>

                    <div className="neu-inset p-3.5 sm:p-4 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-between gap-3 shadow-inner">
                        <code className="text-sm sm:text-base font-black tracking-widest text-[#1a1c35] font-mono break-all select-all">
                            {isKeyRevealed ? recoveryKey : '•••• •••• •••• ••••'}
                        </code>
                        {isKeyRevealed && (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`neu-button px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 transition-all shrink-0 ${
                                    copied
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : 'text-[#549acb] hover:text-[#3d84b5]'
                                }`}
                                title="Copy Key"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        )}
                    </div>
                    <p className="text-[11px] font-medium text-[#717699] flex items-center space-x-1.5 pt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Use this master key with your username to reset your password if you ever forget it.</span>
                    </p>
                </div>

                {/* Action Footer: Only Download Credentials Button */}
                <div className="pt-3 border-t border-slate-200/60">
                    <button
                        type="button"
                        onClick={handleDownloadFile}
                        className="w-full neu-button py-3 px-4 rounded-2xl text-xs font-black text-[#515777] hover:text-[#1a1c35] flex items-center justify-center space-x-2 transition-all hover:scale-101 active:scale-99"
                        title="Download credentials as txt file"
                    >
                        <Download className="w-4 h-4 text-[#549acb]" />
                        <span>Download Account Credentials (.txt)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
