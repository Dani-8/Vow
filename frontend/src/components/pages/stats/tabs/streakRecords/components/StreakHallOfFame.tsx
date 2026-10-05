import React from 'react';
import { Trophy, Medal, Crown, Award, CheckCircle2, Flame } from 'lucide-react';
import { Task } from '../../../../../../types';
import { getCategoryIconComponent } from '../../../../../common/categoryIcons';

interface StreakHallOfFameProps {
    hallOfFame: Task[];
}

const rankConfigs = [
    {
        title: 'Rank 1 • Champion',
        icon: Crown,
        iconColor: 'text-amber-500',
        badgeBg: 'bg-amber-500/15 text-amber-600 border border-amber-400/50',
        ringColor: 'border-amber-400',
    },
    {
        title: 'Rank 2 • Contender',
        icon: Medal,
        iconColor: 'text-slate-400',
        badgeBg: 'bg-slate-400/15 text-slate-600 border border-slate-400/50',
        ringColor: 'border-slate-400',
    },
    {
        title: 'Rank 3 • Vanguard',
        icon: Award,
        iconColor: 'text-[#c27803]',
        badgeBg: 'bg-amber-700/15 text-[#c27803] border border-amber-600/40',
        ringColor: 'border-amber-600/70',
    },
];

export const StreakHallOfFame: React.FC<StreakHallOfFameProps> = ({ hallOfFame }) => {
    return (
        <div className="lg:col-span-8 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1a1c35]">Streak Hall of Fame</h3>
                            <p className="text-xs text-[#717699] font-medium">
                                All-time top 3 sustained daily disciplines & habits
                            </p>
                        </div>
                    </div>
