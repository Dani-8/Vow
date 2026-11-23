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
