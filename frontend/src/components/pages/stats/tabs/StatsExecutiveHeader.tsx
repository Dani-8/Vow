import React from 'react';
import { ShieldCheck, Flame, Sparkles, Trophy } from 'lucide-react';
import { EcosystemOverview } from '../statsHelpers';

interface StatsExecutiveHeaderProps {
    overview: EcosystemOverview;
}

export const StatsExecutiveHeader: React.FC<StatsExecutiveHeaderProps> = ({ overview }) => {
    const { consistencyScore, consistencyGrade, activeDaysLast30, masterStreak, bestMasterStreak } = overview;

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

                <div className="px-3 py-1.5 rounded-xl neu-inset flex items-center space-x-2 bg-[#E0E5EC]/80">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[#1a1c35] font-black">{masterStreak}d Master</span>
                    <span className="text-[10px] text-[#717699] font-semibold border-l border-slate-300 pl-2">
                        Best: <strong className="text-[#549acb]">{bestMasterStreak}d</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};
