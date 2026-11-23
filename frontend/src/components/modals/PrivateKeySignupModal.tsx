import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Download, ArrowRight, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface PrivateKeySignupModalProps {
    isOpen: boolean;
    user: User | null;
    recoveryKey: string;
    onCloseAndEnterApp: () => void;
}

export const PrivateKeySignupModal: React.FC<PrivateKeySignupModalProps> = ({
    isOpen,
    user,
    recoveryKey,
    onCloseAndEnterApp,
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !user) return null;

    const handleCopy = () => {
        if (!recoveryKey) return;
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
Created At:   ${new Date().toLocaleString()}

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
                {/* Header Icon + Title */}
                <div className="flex items-center space-x-3.5 pb-2">
                    <div className="w-12 h-12 rounded-2xl neu-button-primary flex items-center justify-center text-white shrink-0 shadow-md">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#549acb] block">
                            Security Vault Created
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1a1c35] tracking-tight">
                            Your Private Account Key
                        </h2>
                    </div>
                </div>

                {/* Account Details Capsule */}
                <div className="neu-inset p-3.5 rounded-2xl bg-white/40 border border-white/60 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0 font-black text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-[#1a1c35] truncate">{user.name}</p>
                        <p className="text-[11px] font-bold text-[#717699] truncate">@{user.username}</p>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 shrink-0">
                        100% Private
                    </span>
                </div>

                {/* Key Box with Copy Button */}
                <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#515777] block">
                        Master Recovery Key
                    </label>
                    <div className="neu-inset p-3.5 sm:p-4 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-between gap-3 shadow-inner">
                        <code className="text-sm sm:text-base font-black tracking-widest text-[#1a1c35] select-all font-mono break-all">
                            {recoveryKey}
                        </code>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`neu-button px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shrink-0 ${copied
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'text-[#549acb] hover:text-[#3d84b5]'
                                }`}
                            title="Copy Key to Clipboard"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy Key'}</span>
                        </button>
                    </div>
                </div>

                {/* Explanation Note */}
                <div className="neu-inset p-4 rounded-2xl bg-sky-50/50 border border-sky-200/60 text-xs text-[#24294a] leading-relaxed font-medium space-y-2">
                    <p className="flex items-start space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                            <strong>Store this key safely offline.</strong> If you ever forget your password, this key is the only way to recover your account.
                        </span>
                    </p>
                    <p className="text-[11px] text-[#616c8c] border-t border-sky-200/50 pt-2 flex items-start space-x-2">
                        <UserIcon className="w-4 h-4 text-[#549acb] shrink-0 mt-0.5" />
                        <span>
                            <strong>Where to find it later:</strong> If you are logged in, click your <strong>user profile icon on the sidebar or navbar</strong> anytime to copy this key or re-download your backup file.
                        </span>
                    </p>
                </div>

                {/* The 2 Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleDownloadFile}
                        className="w-full sm:flex-1 neu-button py-3 px-4 rounded-2xl text-xs font-black text-[#515777] hover:text-[#1a1c35] flex items-center justify-center space-x-2 transition-all hover:scale-102 active:scale-98"
                    >
                        <Download className="w-4 h-4 text-[#549acb]" />
                        <span>Download Key File (.txt)</span>
                    </button>

                    <button
                        type="button"
                        onClick={onCloseAndEnterApp}
                        className="w-full sm:flex-1 neu-button-primary py-3 px-5 rounded-2xl text-xs font-black text-white flex items-center justify-center space-x-2 shadow-lg hover:scale-102 active:scale-98 transition-all"
                    >
                        <span>I've Saved It, Enter App</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>
            </div>
        </div>
    );
};
