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
