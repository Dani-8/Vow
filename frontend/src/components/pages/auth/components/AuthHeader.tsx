import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthHeaderProps {
    onBackToHome: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ onBackToHome }) => {
    return (
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
    );
};
