import React from 'react';
import { AuthHeader } from './components/AuthHeader';
import { AuthForm } from './components/AuthForm';
import { AuthPreviewCard } from './components/AuthPreviewCard';
import { AuthFooter } from './components/AuthFooter';
import { User } from '../../../types';

interface AuthPageProps {
    onSuccess: (user: User, token: string, recoveryKey?: string) => void;
    onBypass: () => void;
    onBackToHome: () => void;
}
