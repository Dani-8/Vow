import React from 'react';
import { Trophy } from 'lucide-react';

export const StatsHeaderCard: React.FC = () => {
    return (
        <div className="neu-card p-6 border-l-4 border-[#549acb]">
            <div className="flex items-center space-x-3 mb-2">
                <Trophy className="w-6 h-6 text-[#549acb]" />
                <h2 className="text-xl font-black text-[#1a1c35]">Personal Growth & Streak Analytics</h2>
            </div>
            <p className="text-xs text-[#717699] max-w-2xl leading-relaxed font-medium">
                Vow tracks streaks without shame or punishment. When you miss a day, your current counter quietly resets to 0, while your <strong className="text-[#44476A]">Best Streak</strong> remains permanently honored so you can aim to break your personal record.
            </p>
        </div>
    );
};
