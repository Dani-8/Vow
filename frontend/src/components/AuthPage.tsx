import React, { useState } from 'react';
import {
    Flame,
    ShieldCheck,
    Mail,
    Lock,
    User as UserIcon,
    ArrowLeft,
    AlertCircle,
    Sparkles,
    CheckCircle2,
    Trophy,
    Bot,
    Unlock,
    ArrowRight,
} from 'lucide-react';
import { api } from '../api';
import { User } from '../types';

interface AuthPageProps {
    onSuccess: (user: User, token: string) => void;
    onBypass: () => void;
    onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBypass, onBackToHome }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.login(email, password);
                onSuccess(res.user, res.token);
            } else {
                const res = await api.signup(email, password, name);
                onSuccess(res.user, res.token);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#E0E5EC] text-[#44476A] flex flex-col justify-between p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
            {/* Background Ambient Iridescent Glow Blobs (Craftly & Lumin style blur) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-300/40 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-300/40 blur-[140px] pointer-events-none" />
            <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-amber-200/40 blur-[100px] pointer-events-none" />

            {/* Top Navbar */}
            <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 mb-6 sm:mb-8">
                <div
                    onClick={onBackToHome}
                    className="flex items-center space-x-3 cursor-pointer group"
                >
                    <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-md group-hover:scale-105 transition-transform">
                        <span className="font-black text-xl italic">V</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#1a1c35] tracking-tight">Vow</h1>
                        <p className="text-[10px] font-bold text-[#717699] uppercase tracking-wider">Non-Punitive Tasks</p>
                    </div>
                </div>

                <button
                    onClick={onBackToHome}
                    className="neu-button px-4 py-2 rounded-2xl text-xs font-extrabold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-2 backdrop-blur-md bg-white/40"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Landing</span>
                </button>
            </header>

            {/* Main Container Split View */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
                {/* Left Side: Frosted Glass Form Card */}
                <div className="lg:col-span-6 w-full neu-card p-6 sm:p-8 md:p-10 backdrop-blur-2xl bg-white/60 border border-white/80 shadow-2xl rounded-3xl space-y-6">
                    <div>
                        <div className="inline-flex items-center space-x-2 neu-inset px-3 py-1 rounded-full text-[11px] font-extrabold text-[#549acb] uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-[#549acb]" />
                            <span>{isLogin ? 'Welcome Back' : 'Create Free Account'}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1c35] tracking-tight">
                            {isLogin ? 'Access Your Workspace' : 'Start Building Habits'}
                        </h2>
                        <p className="text-xs text-[#717699] font-medium mt-1 leading-relaxed">
                            Achieve daily operational momentum with non-punitive streaks and protected growth vaults.
                        </p>
                    </div>

                    {/* Quick Instant Dev Bypass Option */}
                    <div className="neu-inset p-4 rounded-2xl border border-emerald-400/50 bg-emerald-50/40 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-[#1a1c35]">Instant Testing Mode</p>
                                <p className="text-[10px] text-[#717699]">One-click login with demo account</p>
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

                    {/* Tab Switcher */}
                    <div className="flex neu-inset p-1.5 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${isLogin ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699]'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${!isLogin ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699]'
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="neu-inset p-3 rounded-xl border border-rose-300 bg-rose-50/50 flex items-center space-x-2 text-rose-700 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#717699] block">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="w-4 h-4 text-[#717699] absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Rivera"
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl neu-input text-xs font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#717699] block">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#717699] absolute left-3.5 top-3.5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@workplace.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl neu-input text-xs font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#717699] block">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#717699] absolute left-3.5 top-3.5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl neu-input text-xs font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl neu-button-primary font-extrabold text-xs shadow-lg mt-2 flex items-center justify-center space-x-2"
                        >
                            <span>{loading ? 'Processing...' : isLogin ? 'Sign In to Vow' : 'Register Account'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-[11px] text-center text-[#717699] font-medium pt-2">
                        By continuing, you agree to Vow's Terms of Service & Privacy Policy.
                    </p>
                </div>

                {/* Right Side: Visual Showcase Card (Craftly & Lumin style preview) */}
                <div className="lg:col-span-6 hidden lg:flex flex-col space-y-6 pl-4">
                    <div className="neu-card p-8 bg-gradient-to-br from-[#E0E5EC]/80 via-sky-50/60 to-purple-50/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl space-y-6 relative overflow-hidden">
                        {/* Top Stat Badge */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-[#549acb] text-white flex items-center justify-center font-bold text-xs shadow">
                                    <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-[#1a1c35]">2M+ Streak Days</h4>
                                    <p className="text-[10px] text-[#717699] font-bold">Consistent progress globally</p>
                                </div>
                            </div>

                            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Non-Punitive Active
                            </span>
                        </div>

                        {/* Mock Mobile Phone Preview Card (Reference Craftly Style) */}
                        <div className="neu-card p-6 bg-[#E0E5EC] rounded-2xl space-y-4 shadow-xl border-2 border-[#549acb]/20 max-w-sm mx-auto transform hover:rotate-1 transition-transform">
                            <div className="flex items-center justify-between border-b border-white/60 pb-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#549acb] text-white flex items-center justify-center font-bold text-xs">
                                        V
                                    </div>
                                    <span className="text-xs font-black text-[#1a1c35]">Vow Workspace</span>
                                </div>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg neu-inset text-[#549acb]">
                                    🔥 14d Master
                                </span>
                            </div>

                            {/* Mock habit task 1 */}
                            <div className="neu-card p-3.5 space-y-1.5 bg-[#E0E5EC]">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#1a1c35]">Morning Inspection Routine</span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                                <p className="text-[10px] text-[#717699]">5 of 5 daily checklists completed</p>
                            </div>

                            {/* Mock habit task 2 (Vault protected) */}
                            <div className="neu-card p-3.5 space-y-1.5 bg-[#E0E5EC]">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#1a1c35]">Executive Strategy Vow</span>
                                    <span className="text-[9px] font-extrabold text-purple-600 flex items-center space-x-0.5">
                                        <Unlock className="w-3 h-3" />
                                        <span>PIN Vault</span>
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#717699]">Confidential growth targets locked</p>
                            </div>

                            {/* Gemini AI pill */}
                            <div className="neu-inset p-3 rounded-xl flex items-center justify-between text-[11px] font-bold text-[#549acb]">
                                <div className="flex items-center space-x-1.5">
                                    <Bot className="w-4 h-4 text-[#549acb]" />
                                    <span>Gemini AI Task Coach</span>
                                </div>
                                <span className="text-[9px] text-[#717699]">Ready</span>
                            </div>
                        </div>

                        {/* Metric pill row below */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="neu-inset p-3 rounded-2xl text-center">
                                <span className="text-xs font-black text-[#1a1c35] block">15k+</span>
                                <span className="text-[10px] text-[#717699] font-bold">Active Goals</span>
                            </div>
                            <div className="neu-inset p-3 rounded-2xl text-center">
                                <span className="text-xs font-black text-[#549acb] block">99%</span>
                                <span className="text-[10px] text-[#717699] font-bold">Retention Rate</span>
                            </div>
                            <div className="neu-inset p-3 rounded-2xl text-center">
                                <span className="text-xs font-black text-purple-600 block">100%</span>
                                <span className="text-[10px] text-[#717699] font-bold">PIN Privacy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full max-w-6xl mx-auto text-center z-20 mt-6 pt-4 border-t border-white/40">
                <p className="text-xs text-[#717699] font-medium">
                    © {new Date().getFullYear()} Vow App Inc. • All rights reserved.
                </p>
            </footer>
        </div>
    );
};
