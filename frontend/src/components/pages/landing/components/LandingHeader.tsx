import React from 'react';
import { ShieldCheck, LogIn, ArrowRight } from 'lucide-react';

interface LandingHeaderProps {
    onEnterApp: () => void;
    onOpenAuth: () => void;
    onBypassAuth: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
    onEnterApp,
    onOpenAuth,
    onBypassAuth,
}) => {
    return (
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between z-30 relative">
            <div
                onClick={onEnterApp}
                className="flex items-center space-x-3 cursor-pointer group"
            >
                <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-md group-hover:scale-105 transition-transform">
                    <span className="font-black text-xl italic">V</span>
                </div>
                <div>
                    <h1 className="text-xl font-black text-[#1a1c35] tracking-tight">Vow</h1>
                    <p className="text-[10px] font-bold text-[#717699] uppercase tracking-wider">Growth & Task Operations</p>
                </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8 neu-inset px-6 py-2 rounded-2xl">
                <a href="#features" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
                    Core Features
                </a>
                <a href="#industries" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
                    Industries
                </a>
                <a href="#ai-coach" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
                    Gemini AI
                </a>
                <a href="#vault" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
                    PIN Vault
                </a>
            </nav>

            <div className="flex items-center space-x-3">
                <button
                    onClick={onBypassAuth}
                    className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300/60 hover:bg-emerald-200 transition-colors shadow-sm"
                    title="Instant Dev Bypass for testing"
                >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dev Bypass</span>
                </button>

                <button
                    onClick={onOpenAuth}
                    className="neu-button px-4 py-2 rounded-xl text-xs font-extrabold text-[#549acb] hover:text-[#1a1c35] flex items-center space-x-1.5"
                >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                </button>

                <button
                    onClick={onEnterApp}
                    className="neu-button-primary px-5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md"
                >
                    <span>Launch App</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
};
