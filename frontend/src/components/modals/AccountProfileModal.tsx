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
