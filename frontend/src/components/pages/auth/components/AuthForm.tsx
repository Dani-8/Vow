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

        try {
            if (authMode === 'login') {
                const res = await api.login(username.trim(), password);
                onSuccess(res.user, res.token);
            } else if (authMode === 'signup') {
                const res = await api.signup(username.trim(), password, name.trim());
                // Pass recoveryKey back so the PrivateKeySignupModal can open
                onSuccess(res.user, res.token, res.recoveryKey);
            } else if (authMode === 'forgot') {
                const res = await api.resetPassword(username.trim(), recoveryKeyInput.trim(), newPassword);
                setResetSuccessMsg('Password reset successfully! Logging you in...');
                setTimeout(() => {
                    onSuccess(res.user, res.token);
                }, 1000);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication request failed');
        } finally {
            setLoading(false);
        }
    };