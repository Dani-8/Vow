import React from 'react';
import { Target, Check, ArrowUpRight } from 'lucide-react';

interface QuickProgressCardProps {
    completedTodayCount: number;
    remainingTodayCount: number;
    progressPercent: number;
}

export const QuickProgressCard: React.FC<QuickProgressCardProps> = ({
    completedTodayCount,
    remainingTodayCount,
    progressPercent,
}) => {
    return (
        <div className="neu-card p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-[#549acb]" />
                    <h3 className="text-sm font-extrabold text-[#1a1c35]">Today's Progress</h3>
                </div>
                <p className="text-[11px] text-[#717699] font-medium mb-4">Quick overview</p>

                <div className="grid grid-cols-3 gap-2">
                    <div className="neu-inset p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base font-black text-[#1a1c35]">{completedTodayCount}</span>
                        <span className="text-[9px] font-bold text-[#717699]">Completed</span>
                    </div>

                    <div className="neu-inset p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-1">
                            <Target className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base font-black text-[#1a1c35]">{remainingTodayCount}</span>
                        <span className="text-[9px] font-bold text-[#717699]">Remaining</span>
                    </div>

                    <div className="neu-inset p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base font-black text-[#1a1c35]">{progressPercent}%</span>
                        <span className="text-[9px] font-bold text-[#717699]">Progress</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
