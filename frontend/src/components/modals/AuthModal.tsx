import React, { useState } from 'react';
import { LogIn, UserPlus, X, Flame, Sparkles } from 'lucide-react';
import { api } from '../../api';
import { User } from '../../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessAuth: (user: User) => void;
}