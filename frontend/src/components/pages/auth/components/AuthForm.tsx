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

    return (
        <div className="lg:col-span-6 w-full neu-card p-6 sm:p-8 md:p-10 backdrop-blur-2xl bg-white/60 border border-white/80 shadow-2xl rounded-3xl space-y-6 text-left">
            {/* Header Titles */}
            <div>
                <div className="inline-flex items-center space-x-2 neu-inset px-3 py-1 rounded-full text-[11px] font-extrabold text-[#549acb] uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#549acb]" />
                    <span>
                        {authMode === 'login'
                            ? 'Welcome Back'
                            : authMode === 'signup'
                            ? 'Private Account Creation'
                            : 'Recovery Key Reset'}
                    </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1a1c35] tracking-tight">
                    {authMode === 'login'
                        ? 'Access Your Workspace'
                        : authMode === 'signup'
                        ? 'Create Your Account'
                        : 'Forgot Password'}
                </h2>
                <p className="text-xs text-[#717699] font-medium mt-1 leading-relaxed">
                    {authMode === 'forgot'
                        ? 'Enter your unique username and private recovery key to set a new password.'
                        : 'Zero email trackers. Private unique username + password with client-side recovery keys.'}
                </p>
            </div>
