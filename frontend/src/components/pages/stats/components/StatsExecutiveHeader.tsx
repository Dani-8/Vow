import React from 'react';
import { ShieldCheck, Flame, Sparkles, Trophy } from 'lucide-react';
import { EcosystemOverview } from '../statsHelpers';

interface StatsExecutiveHeaderProps {
    overview: EcosystemOverview;
}

export const StatsExecutiveHeader: React.FC<StatsExecutiveHeaderProps> = ({ overview }) => {
    const { consistencyScore, consistencyGrade, activeDaysLast30, masterStreak, bestMasterStreak } = overview;

    return (
        <div className="neu-card px-5 py-3.5 rounded-2xl border border-white/80 bg-[#E0E5EC] flex flex-col md:flex-row items-center justify-between gap-3.5">
            {/* Left: Quick Identity and Badge */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                        <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                        <h2 className="text-sm font-black text-[#1a1c35] tracking-tight">Progress & Insights</h2>
                        <span className="text-[10px] font-bold text-[#717699]">Unified Ecosystem Telemetry</span>
                    </div>
                </div>

                <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full neu-inset text-[10px] font-extrabold text-emerald-600 bg-[#E0E5EC]/90">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Non-Punitive Engine</span>
                </span>
            </div>

            {/* Right: Key Micro Stats Strip */}
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end text-xs font-bold">
                <div className="px-3 py-1.5 rounded-xl neu-inset flex items-center space-x-2 bg-[#E0E5EC]/80">
                    <span className="text-[10px] uppercase font-extrabold text-[#717699]">Consistency</span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black text-white bg-[#549acb]">
                        {consistencyScore}% ({consistencyGrade})
                    </span>
                    <span className="text-[10px] font-medium text-[#717699]">
                        {activeDaysLast30}/30d
                    </span>
                </div>