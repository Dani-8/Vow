import React, { useState } from 'react';
import {
    Mail,
    Lock,
    User as UserIcon,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    LucideIcon,
} from 'lucide-react';
import { api } from '../../../../api';
import { User } from '../../../../types';

interface AuthFormProps {
    onSuccess: (user: User, token: string) => void;
    onBypass: () => void;
}

interface FieldConfig {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    icon: LucideIcon;
    value: string;
    onChange: (val: string) => void;
    show: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onBypass }) => {
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

    const fields: FieldConfig[] = [
        {
            id: 'name',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Alex Rivera',
            icon: UserIcon,
            value: name,
            onChange: setName,
            show: !isLogin,
        },
        {
            id: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'alex@workplace.com',
            icon: Mail,
            value: email,
            onChange: setEmail,
            show: true,
        },
        {
            id: 'password',
            label: 'Password',
            type: 'password',
            placeholder: '••••••••',
            icon: Lock,
            value: password,
            onChange: setPassword,
            show: true,
        },
    ];

    const authModes = [
        { key: true, label: 'Sign In' },
        { key: false, label: 'Create Account' },
    ];

    return (
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

            <div className="flex neu-inset p-1.5 rounded-2xl">
                {authModes.map((mode) => (
                    <button
                        key={String(mode.key)}
                        type="button"
                        onClick={() => {
                            setIsLogin(mode.key);
                            setError('');
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${isLogin === mode.key ? 'neu-button text-[#549acb] bg-[#E0E5EC]' : 'text-[#717699]'
                            }`}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="neu-inset p-3 rounded-xl border border-rose-300 bg-rose-50/50 flex items-center space-x-2 text-rose-700 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {fields
                    .filter((f) => f.show)
                    .map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.id} className="space-y-1">
                                <label className="text-xs font-bold text-[#717699] block">{field.label}</label>
                                <div className="relative">
                                    <Icon className="w-4 h-4 text-[#717699] absolute left-3.5 top-3.5" />
                                    <input
                                        type={field.type}
                                        required
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl neu-input text-xs font-medium"
                                    />
                                </div>
                            </div>
                        );
                    })}

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
    );
};
