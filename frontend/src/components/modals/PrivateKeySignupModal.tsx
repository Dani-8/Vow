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
