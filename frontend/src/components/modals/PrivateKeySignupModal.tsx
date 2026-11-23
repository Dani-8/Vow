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
