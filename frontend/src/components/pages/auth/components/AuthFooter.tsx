import React from 'react';

export const AuthFooter: React.FC = () => {
    return (
        <footer className="w-full max-w-6xl mx-auto text-center z-20 mt-6 pt-4 border-t border-white/40">
            <p className="text-xs text-[#717699] font-medium">
                © {new Date().getFullYear()} Vow App Inc. • All rights reserved.
            </p>
        </footer>
    );
};
