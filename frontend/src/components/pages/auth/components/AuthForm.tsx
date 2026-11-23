import React, { useState } from 'react';
import {
    Lock,
    User as UserIcon,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    KeyRound,
    CheckCircle2,
    AtSign,
} from 'lucide-react';
import { api } from '../../../../api';
import { User } from '../../../../types';

interface AuthFormProps {
    onSuccess: (user: User, token: string, recoveryKey?: string) => void;
    onBypass: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onBypass }) => {
    // Modes: 'login' | 'signup' | 'forgot'
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [recoveryKeyInput, setRecoveryKeyInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetSuccessMsg, setResetSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResetSuccessMsg('');
        setLoading(true);