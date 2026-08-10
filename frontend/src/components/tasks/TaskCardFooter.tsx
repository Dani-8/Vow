import React from 'react';
import { Flame, Trophy, AlertCircle, Clock } from 'lucide-react';

interface TaskCardFooterProps {
    currentStreak: number;
    bestStreak: number;
    isCompleted: boolean;
    timeLeftStr: string | null;
    isStruggling: boolean;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({
    currentStreak,
    bestStreak,
    isCompleted,
    timeLeftStr,
    isStruggling,
}) => {
    return (
        <div className="pt-3 border-t border-white/40 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3 text-xs">
                <div
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl neu-badge ${currentStreak > 0
                            ? 'text-[#549acb] bg-[#E0E5EC] font-bold border border-sky-200/50'
                            : 'text-[#717699] font-medium'
                        }`}
                >
                    <Flame
                        className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-[#549acb] fill-[#549acb]' : 'text-[#717699]'
                            }`}
                    />
                    <span>
                        {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Current
                    </span>
                </div>

                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl neu-badge text-[#44476A] font-bold">
                    <Trophy className="w-3.5 h-3.5 text-[#549acb]" />
                    <span>Best: {bestStreak}d</span>
                </div>

                {currentStreak === 0 && bestStreak > 0 && !isCompleted && (
                    <span className="text-[10px] font-bold text-[#549acb] neu-inset px-2 py-0.5 rounded-lg">
                        Beat record of {bestStreak}d!
                    </span>
                )}
            </div>

            {timeLeftStr && (
                <div
                    className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-xl neu-badge ${timeLeftStr === 'Overdue'
                            ? 'text-rose-700 bg-rose-50 border border-rose-200'
                            : isStruggling
                                ? 'text-amber-700 bg-amber-50 border border-amber-200'
                                : 'text-[#717699]'
                        }`}
                >
                    {timeLeftStr === 'Overdue' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                        <Clock className="w-3.5 h-3.5 text-[#6D5DFC]" />
                    )}
                    <span>{timeLeftStr}</span>
                </div>
            )}
        </div>
    );
};
