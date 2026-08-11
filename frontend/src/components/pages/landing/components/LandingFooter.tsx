import React from 'react';

export const LandingFooter: React.FC = () => {
    return (
        <footer className="w-full border-t border-white/60 py-8 text-center bg-[#E0E5EC]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl neu-button flex items-center justify-center bg-[#549acb] text-white font-bold text-xs italic">
                        V
                    </div>
                    <span className="text-sm font-black text-[#1a1c35]">Vow Task & Streak Platform</span>
                </div>

                <p className="text-xs text-[#717699] font-medium">
                    © {new Date().getFullYear()} Vow Inc. • Powered by Gemini AI & Non-Punitive Streak Engine
                </p>
            </div>
        </footer>
    );
};
