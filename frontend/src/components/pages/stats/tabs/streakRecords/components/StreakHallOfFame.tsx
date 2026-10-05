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

                    <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center space-x-1">
                        <Medal className="w-3.5 h-3.5" />
                        <span>Permanent Vault</span>
                    </span>
                </div>

                {hallOfFame.length === 0 ? (
                    <div className="neu-inset p-8 rounded-2xl text-center space-y-2 border border-dashed border-slate-300">
                        <div className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-[#E0E5EC]">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-black text-[#1a1c35]">No Streak Records Established</h4>
                        <p className="text-[11px] font-medium text-[#717699] max-w-sm mx-auto">
                            Complete tasks and daily habits consistently to earn your place on the all-time podium.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {hallOfFame.map((item, idx) => {
                            const Icon = getCategoryIconComponent(item.icon || item.category);
                            const best = Math.max(item.bestStreak || 0, item.currentStreak || 0);
                            const cur = item.currentStreak || 0;
                            const isDoneToday = Boolean(item.completedToday || item.status === 'completed');
                            const rank = rankConfigs[idx] || rankConfigs[2];
                            const RankIcon = rank.icon;

                            return (
                                <div
                                    key={item._id}
                                    className={`neu-inset p-4 rounded-2xl space-y-3 border ${rank.ringColor} bg-[#E0E5EC]/80 flex flex-col justify-between group hover:scale-[1.01] transition-all`}
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 ${rank.badgeBg}`}>
                                                <RankIcon className={`w-3 h-3 ${rank.iconColor}`} />
                                                <span>{rank.title}</span>
                                            </span>

                                            <div className="w-7 h-7 rounded-lg neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
                                                <Icon className="w-3.5 h-3.5" />
                                            </div>
                                        </div>

                                        <h4 className="text-xs font-black text-[#1a1c35] line-clamp-2 leading-snug">
                                            {item.title}
                                        </h4>

                                        <div className="flex items-center space-x-1.5">
                                            {isDoneToday ? (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 flex items-center space-x-1">
                                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                                    <span>Done Today</span>
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-amber-700 bg-amber-500/15 border border-amber-500/30 flex items-center space-x-1">
                                                    <Flame className="w-2.5 h-2.5 text-amber-500" />
                                                    <span>Pending Today</span>
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold text-[#717699]">
                                                {cur}d active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-300/80 flex items-baseline justify-between">
                                        <span className="text-[10px] font-bold text-[#717699]">All-Time Peak</span>
                                        <span className={`text-base font-black ${rank.iconColor}`}>{best} Days</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
