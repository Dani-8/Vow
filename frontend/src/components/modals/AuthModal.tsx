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