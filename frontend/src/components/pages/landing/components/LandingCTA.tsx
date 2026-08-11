import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface LandingCTAProps {
    onEnterApp: () => void;
    onBypassAuth: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({
    onEnterApp,
    onBypassAuth,
}) => {
    return (
        <section className="neu-card p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 bg-gradient-to-r from-sky-50/50 via-[#E0E5EC] to-indigo-50/50">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1c35] tracking-tight">
                Ready to experience non-punitive streak tracking?
            </h2>
            <p className="text-xs sm:text-sm text-[#717699] font-medium max-w-xl mx-auto">
                Test the live app immediately with one-click Dev Bypass or register your free account today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                    onClick={onEnterApp}
                    className="neu-button-primary px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg"
                >
                    <span>Launch Live App</span>
                    <ArrowRight className="w-4 h-4" />
                </button>

                <button
                    onClick={onBypassAuth}
                    className="neu-button px-6 py-3.5 rounded-2xl text-xs font-extrabold text-emerald-700 flex items-center space-x-2 border border-emerald-300"
                >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant Dev Bypass</span>
                </button>
            </div>
        </section>
    );
};
