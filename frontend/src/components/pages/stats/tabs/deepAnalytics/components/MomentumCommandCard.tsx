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

                {/* Progress Bar Gauge */}
                <div className="w-full h-2 rounded-full neu-inset overflow-hidden p-0.5">
                    <div
                        className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#549acb] to-emerald-500"
                        style={{ width: `${momentumScore}%` }}
                    />
                </div>

                <div className="flex justify-between text-[11px] font-bold text-[#717699] pt-1 border-t border-slate-300/70">
                    <span>Active Execution Pace:</span>
                    <span className="text-[#1a1c35] font-black">{currentActiveDays} of {effectiveDays} Days</span>
                </div>
            </div>

            {/* Cadence Insights Cue */}
            <div className="neu-card p-4 rounded-2xl border border-white/60 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-black text-[#1a1c35]">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Cadence Insights</span>
                </div>

                {trendState === 'rising' && (
                    <p className="text-[#44476A] font-medium leading-relaxed">
                        {activeCategoryFilter ? (
                            <>In <strong className="text-[#1a1c35]">{activeCategoryFilter}</strong>, you are outpacing your baseline by <strong className="text-emerald-600 font-bold">+{growthPercent}%</strong>. This domain is compounding fast.</>
                        ) : (
                            <>You are outperforming your prior pace by <strong className="text-emerald-600 font-bold">+{growthPercent}%</strong>. Your unbroken discipline is compounding into permanent routine.</>
                        )}
                    </p>
                )}
                {trendState === 'steady' && (
                    <p className="text-[#44476A] font-medium leading-relaxed">
                        {activeCategoryFilter ? (
                            <>Consistent execution in <strong className="text-[#1a1c35]">{activeCategoryFilter}</strong> with <strong className="text-[#549acb] font-bold">{currentTotal} actions</strong> logged.</>
                        ) : (
                            <>Stable cadence. You have sustained <strong className="text-[#549acb] font-bold">{currentTotal} actions</strong> across challenges and habits. One extra check-in today initiates a growth surge.</>
                        )}
                    </p>
                )}
                {trendState === 'cooling' && (
                    <p className="text-[#44476A] font-medium leading-relaxed">
                        {activeCategoryFilter ? (
                            <>A pause in <strong className="text-[#1a1c35]">{activeCategoryFilter}</strong>. A single log or task completion today will reignite momentum in this domain.</>
                        ) : (
                            <>A slight pace breather detected. Non-punitive rule: <strong className="text-[#549acb] font-bold">just 1 micro-task or challenge log today</strong> bends your trajectory back upward.</>
                        )}
                    </p>
                )}

                <div className="flex items-center justify-between text-[10px] font-extrabold text-[#717699] pt-1.5 border-t border-slate-200">
                    <span>Current: <strong className="text-[#1a1c35]">{currentTotal} actions</strong></span>
                    <span>Prior: <strong className="text-[#717699]">{prevTotal} actions</strong></span>
                </div>
            </div>
        </div>
    );
};
