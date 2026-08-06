import React, { useState } from 'react';
import { LogIn, UserPlus, X, Flame, Sparkles } from 'lucide-react';
import { api } from '../api';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessAuth: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessAuth }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            if (mode === 'login') {
                const res = await api.login(email, password);
                onSuccessAuth(res.user);
                onClose();
            } else {
                const res = await api.signup(email, password, name);
                onSuccessAuth(res.user);
                onClose();
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            setEmail('demo@vow.app');
            setPassword('demopass');
            const res = await api.login('demo@vow.app', 'demopass');
            onSuccessAuth(res.user);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Demo login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="neu-card w-full max-w-md p-6 bg-[#E0E5EC] relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Brand Banner */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl neu-button flex items-center justify-center bg-[#6D5DFC] text-white shadow-lg mb-3">
                        <Flame className="w-8 h-8 text-indigo-100 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1a1c35]">Welcome to Vow</h2>
                    <p className="text-xs text-[#717699] max-w-xs mt-1 font-medium">
                        JWT Authenticated task manager & personal growth tracker
                    </p>
                </div>

                {/* Quick Demo Login Shortcut */}
                <div className="mb-6 neu-inset p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-800 block">Instant Access</span>
                        <span className="text-[11px] text-slate-500">Includes pre-seeded streaks & PIN vault (PIN: 1234)</span>
                    </div>
                    <button
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="neu-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 hover:bg-white flex items-center space-x-1 shrink-0"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Try Demo</span>
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="flex neu-inset p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'login' ? 'neu-button text-indigo-600 font-bold bg-white' : 'text-slate-500'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'signup' ? 'neu-button text-indigo-600 font-bold bg-white' : 'text-slate-500'
                            }`}
                    >
                        Create Account
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Alex Rivera"
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@vow.app"
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl neu-button-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
                        >
                            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In to Vow' : 'Register Account'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
