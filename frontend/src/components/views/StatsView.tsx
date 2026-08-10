import React from 'react';
import { Flame, Trophy, CheckCircle, Repeat, Target } from 'lucide-react';
import { MasterStreakStats, Task } from '../../types';

interface StatsViewProps {
  stats: MasterStreakStats | null;
  tasks: Task[];
  privateTasks: Task[];
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, tasks, privateTasks }) => {
  if (!stats) return null;

  const allTasks = [...tasks, ...privateTasks];

  const overallBestStreak = allTasks.reduce((max, t) => Math.max(max, t.bestStreak || 0), 0);

  return (
    <div className="space-y-6">
      <div className="neu-card p-6 border-l-4 border-[#549acb]">
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="w-6 h-6 text-[#549acb]" />
          <h2 className="text-xl font-black text-[#1a1c35]">Personal Growth & Streak Analytics</h2>
        </div>
        <p className="text-xs text-[#717699] max-w-2xl leading-relaxed font-medium">
          Vow tracks streaks without shame or punishment. When you miss a day, your current counter quietly resets to 0, while your <strong className="text-[#44476A]">Best Streak</strong> remains permanently honored so you can aim to break your personal record.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
            <Flame className="w-6 h-6 fill-[#549acb]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#717699] block">Master Streak</span>
            <span className="text-2xl font-black text-[#1a1c35]">{stats.masterStreak} Days</span>
          </div>
        </div>

        <div className="neu-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
            <Trophy className="w-6 h-6 text-[#549acb]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#717699] block">Personal Best Streak</span>
            <span className="text-2xl font-black text-[#549acb]">{overallBestStreak} Days</span>
          </div>
        </div>

        <div className="neu-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-emerald-600 bg-[#E0E5EC] shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#717699] block">Total Check-In Days</span>
            <span className="text-2xl font-black text-emerald-700">{stats.totalCheckIns} Days</span>
          </div>
        </div>

        <div className="neu-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-[#E0E5EC] shrink-0">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#717699] block">Habits & Goals</span>
            <span className="text-2xl font-black text-purple-700">{allTasks.length} Tracked</span>
          </div>
        </div>
      </div>

      <div className="neu-card p-6">
        <h3 className="text-base font-bold text-[#1a1c35] mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-[#6D5DFC]" />
          <span>Active Habits & Growth Leaderboard</span>
        </h3>

        {allTasks.length === 0 ? (
          <p className="text-xs text-[#717699] italic">No tasks or habits tracked yet.</p>
        ) : (
          <div className="space-y-3">
            {allTasks.map((task) => (
              <div
                key={task._id}
                className="neu-inset p-3.5 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${task.isPrivate ? 'bg-purple-500' : 'bg-[#6D5DFC]'}`} />
                  <div>
                    <span className="font-bold text-[#1a1c35] text-sm block">{task.title}</span>
                    <span className="text-[#717699] font-medium">
                      {task.isHabit ? 'Daily Habit' : 'Single Goal'} {task.isPrivate ? '• Growth Vault' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#6D5DFC] block">🔥 {task.currentStreak || 0}d Current</span>
                    <span className="text-[11px] text-[#717699] font-medium">🏆 Record: {task.bestStreak || 0}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
