import React from 'react';
import { Lock, Clock, CheckCircle2, Flame, Trophy } from 'lucide-react';
import { Task } from '../../../../../../types';
import { getCategoryIconComponent } from '../../../../../common/categoryIcons';
import { calculateTaskSubTaskProgress } from '../../../../../../utils/subtaskStorage';

interface StreakLeaderboardItemProps {
    task: Task;
    rank: number;
}

export const StreakLeaderboardItem: React.FC<StreakLeaderboardItemProps> = ({ task, rank }) => {
    const Icon = getCategoryIconComponent(task.icon || task.category);
    const subProgress = calculateTaskSubTaskProgress(task._id, task.subTasks);
    const curStreak = task.currentStreak || 0;
    const bestStreak = task.bestStreak || 0;
    const isRecordMatched = curStreak >= bestStreak && curStreak > 0;
    const isDoneToday = Boolean(task.completedToday || task.status === 'completed');

    return (
        <div className="neu-inset p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/40 bg-[#E0E5EC]/90 hover:bg-[#E0E5EC] transition-all">
            <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                <span className="w-6 text-center text-xs font-black text-[#717699] shrink-0">
                    #{rank}
                </span>

                <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
                    <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-sm text-[#1a1c35] truncate">
                            {task.title}
                        </h4>
                        {task.isPrivate && (
                            <span className="p-0.5 rounded-full text-purple-600 shrink-0" title="Private Vault Item">
                                <Lock className="w-3 h-3" />
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-[11px] font-bold text-[#717699]">
                            {task.isHabit ? 'Daily Habit' : 'Single Goal'}
                        </span>
                        {task.category && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full neu-inset text-[#44476A]">
                                {task.category}
                            </span>
                        )}
                        {subProgress.total > 0 && (
                            <span className="text-[10px] font-bold text-[#549acb] flex items-center space-x-1">
                                <span>{subProgress.completed}/{subProgress.total} Subtasks ({subProgress.percent}%)</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 shrink-0 pl-9 sm:pl-0">
                <div className="flex items-center space-x-1.5">
                    {isDoneToday ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Done Today</span>
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-[#717699] bg-slate-300/40 border border-slate-300 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[#717699]" />
                            <span>Pending</span>
                        </span>
                    )}
                </div>

                <div className="text-left sm:text-right space-y-0.5 min-w-[100px]">
                    <div className="flex items-center sm:justify-end space-x-1.5">
                        <span className={`text-sm font-black flex items-center space-x-1 ${curStreak > 0 ? 'text-amber-500' : 'text-[#717699]'
                            }`}>
                            <Flame className={`w-4 h-4 ${curStreak > 0 ? 'fill-amber-500' : ''}`} />
                            <span>{curStreak}d Streak</span>
                        </span>
                        {isRecordMatched && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-600 text-[9px] font-black uppercase">
                                Record!
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] font-bold text-[#549acb] flex items-center sm:justify-end space-x-1">
                        <Trophy className="w-3 h-3" />
                        <span>Best: {bestStreak} Days</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
