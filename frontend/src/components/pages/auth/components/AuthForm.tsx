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

            {/* Instant Dev Testing Bypass */}
            <div className="neu-inset p-4 rounded-2xl border border-emerald-400/50 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-[#1a1c35]">Instant Testing Mode</p>
                        <p className="text-[10px] text-[#717699]">1-click login with demo account</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onBypass}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition-colors flex items-center space-x-1"
                >
                    <span>Instant Bypass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Auth Switcher Pills */}
            <div className="flex neu-inset p-1.5 rounded-2xl">
                <button
                    type="button"
                    onClick={() => {
                        setAuthMode('login');
                        setError('');
                        setResetSuccessMsg('');
                    }}
                    className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${authMode === 'login' ? 'neu-button text-[#549acb] bg-[#E0E5EC] shadow-sm' : 'text-[#717699]'
                        }`}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setAuthMode('signup');
                        setError('');
                        setResetSuccessMsg('');
                    }}
                    className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${authMode === 'signup' ? 'neu-button text-[#549acb] bg-[#E0E5EC] shadow-sm' : 'text-[#717699]'
                        }`}
                >
                    Create Account
                </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
                <div className="neu-inset p-3.5 rounded-xl border border-rose-300 bg-rose-50/70 flex items-center space-x-2 text-rose-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {resetSuccessMsg && (
                <div className="neu-inset p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{resetSuccessMsg}</span>
                </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Sign Up Full Name */}
                {authMode === 'signup' && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#515777] block">Display Name</label>
                        <div className="relative">
                            <UserIcon className="w-4 h-4 text-[#717699] absolute left-3.5 top-3.5" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Alex Rivera"
                                className="w-full pl-10 pr-4 py-3 rounded-2xl neu-input text-xs font-semibold text-[#1a1c35]"
                            />
                        </div>
                    </div>
                )}