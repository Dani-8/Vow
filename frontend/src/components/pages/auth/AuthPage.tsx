import React from 'react';
import { AuthHeader } from './components/AuthHeader';
import { AuthForm } from './components/AuthForm';
import { AuthPreviewCard } from './components/AuthPreviewCard';
import { AuthFooter } from './components/AuthFooter';
import { User } from '../../../types';

interface AuthPageProps {
    onSuccess: (user: User, token: string) => void;
    onBypass: () => void;
    onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBypass, onBackToHome }) => {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#E0E5EC] text-[#44476A] flex flex-col justify-between p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-300/40 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-300/40 blur-[140px] pointer-events-none" />
            <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-amber-200/40 blur-[100px] pointer-events-none" />

            <AuthHeader onBackToHome={onBackToHome} />

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
                <AuthForm onSuccess={onSuccess} onBypass={onBypass} />
                <AuthPreviewCard />
            </div>

            <AuthFooter />
        </div>
    );
};
