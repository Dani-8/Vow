import React, { useState } from 'react';
import { LogIn, UserPlus, X, Flame, Sparkles } from 'lucide-react';
import { api } from '../../api';
import { User } from '../../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessAuth: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessAuth }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [username, setUsername] = useState('');
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
                const res = await api.login(username, password);
                onSuccessAuth(res.user);
                onClose();
            } else {
                const res = await api.signup(username, password, name);
                onSuccessAuth({ ...res.user, recoveryKey: res.recoveryKey });
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
            const res = await api.demoBypass();
            onSuccessAuth(res.user);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Instant access failed');
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

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl neu-button flex items-center justify-center bg-[#6D5DFC] text-white shadow-lg mb-3">
                        <Flame className="w-8 h-8 text-indigo-100 animate-pulse" />
                    </div>
