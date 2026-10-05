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

                    {/* Progress bar toward beating record */}
                    <div className="pt-1 space-y-1">
                        <div className="w-full h-2 rounded-full neu-inset overflow-hidden p-0.5">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isNewRecord
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                                        : 'bg-gradient-to-r from-amber-400 to-[#549acb]'
                                    }`}
                                style={{ width: `${Math.max(6, Math.min(100, recordProgress))}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-bold text-[#717699]">
                            {isNewRecord
                                ? '⚡ All-time peak active! Every day sets a new benchmark.'
                                : `${daysToRecord} more active day${daysToRecord === 1 ? '' : 's'} to surpass personal best.`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-3 py-2 rounded-2xl neu-inset text-xs font-bold text-[#44476A] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#549acb] shrink-0" />
                <span className="text-[11px] leading-tight">Non-punitive resilience engine preserves lifetime momentum.</span>
            </div>
        </div>
    );
};
