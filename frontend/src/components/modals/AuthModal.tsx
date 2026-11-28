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
