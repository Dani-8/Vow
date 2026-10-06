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
