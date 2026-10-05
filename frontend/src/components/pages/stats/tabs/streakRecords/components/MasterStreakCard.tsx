import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

interface MasterStreakCardProps {
    masterStreak: number;
    bestMasterStreak: number;
    recordProgress: number;
    daysToRecord: number;
    isNewRecord: boolean;
}

export const MasterStreakCard: React.FC<MasterStreakCardProps> = ({
    masterStreak,
    bestMasterStreak,
    recordProgress,
    daysToRecord,
    isNewRecord,
}) => {
    return (
        <div className="lg:col-span-4 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
            <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                        <span className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                            <Flame className="w-5 h-5 fill-amber-500" />
                        </span>
                        <div>
                            <h3 className="text-sm font-black text-[#1a1c35]">Master Streak</h3>
                            <span className="text-[10px] font-bold text-[#717699] uppercase tracking-wider">Global Integrity</span>
                        </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-amber-600">
                        {recordProgress}% Record Pace
                    </span>
                </div>

                <div className="neu-inset p-4 rounded-2xl space-y-2.5 bg-[#E0E5EC]/80">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-[#717699]">Active Master Streak</span>
                        <span className="text-2xl font-black text-[#1a1c35] tracking-tight">{masterStreak} Days</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-slate-300 pt-2">
                        <span className="text-xs font-bold text-[#717699]">All-Time High Mark</span>
                        <span className="text-sm font-black text-[#549acb]">{bestMasterStreak} Days Record</span>
                    </div>
