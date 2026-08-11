import React from 'react';
import { Target } from 'lucide-react';
import { Task } from '../../../../types';

interface StatsLeaderboardProps {
    tasks: Task[];
}

export const StatsLeaderboard: React.FC<StatsLeaderboardProps> = ({ tasks }) => {
    return (
        <div className="neu-card p-6">
            <h3 className="text-base font-bold text-[#1a1c35] mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-[#6D5DFC]" />
                <span>Active Habits & Growth Leaderboard</span>
            </h3>

            {tasks.length === 0 ? (
                <p className="text-xs text-[#717699] italic">No tasks or habits tracked yet.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="neu-inset p-3.5 rounded-xl flex items-center justify-between text-xs"
                        >
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${task.isPrivate ? 'bg-purple-500' : 'bg-[#6D5DFC]'
                                        }`}
                                />
                                <div>
                                    <span className="font-bold text-[#1a1c35] text-sm block">{task.title}</span>
                                    <span className="text-[#717699] font-medium">
                                        {task.isHabit ? 'Daily Habit' : 'Single Goal'}{' '}
                                        {task.isPrivate ? '• Growth Vault' : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <span className="text-xs font-bold text-[#6D5DFC] block">
                                        🔥 {task.currentStreak || 0}d Current
                                    </span>
                                    <span className="text-[11px] text-[#717699] font-medium">
                                        🏆 Record: {task.bestStreak || 0}d
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
