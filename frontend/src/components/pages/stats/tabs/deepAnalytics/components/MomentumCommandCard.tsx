import React from 'react';
import { Sparkles, Flame } from 'lucide-react';

interface MomentumCommandCardProps {
    momentumScore: number;
    consistencyGrade: string;
    currentActiveDays: number;
    effectiveDays: number;
    trendState: 'rising' | 'steady' | 'cooling';
    growthPercent: number;
    activeCategoryFilter?: string | null;
    currentTotal: number;
    prevTotal: number;
}

export const MomentumCommandCard: React.FC<MomentumCommandCardProps> = ({
    momentumScore,
    consistencyGrade,
    currentActiveDays,
    effectiveDays,
    trendState,
    growthPercent,
    activeCategoryFilter,
    currentTotal,
    prevTotal,
}) => {
    return (
        <div className="lg:col-span-4 space-y-4">
            {/* Score Inset Display */}
            <div className="neu-inset p-5 rounded-3xl bg-[#E0E5EC]/80 border border-white/60 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#717699]">
                        Discipline Momentum Index
                    </span>
                    <span className="text-xs font-extrabold text-[#549acb] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{consistencyGrade}</span>
                    </span>
                </div>

                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-[#1a1c35] tracking-tight">
                        {momentumScore}
                    </span>
                    <span className="text-sm font-bold text-[#717699]">/ 100</span>
                </div>
