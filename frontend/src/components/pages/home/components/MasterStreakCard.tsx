import React from 'react';
import { Trophy, CheckCircle2, Check, Zap } from 'lucide-react';
import { MasterStreakStats } from '../../../../types';
import { WeekDay } from '../../../../hooks/useHomeData';

interface MasterStreakCardProps {
  stats: MasterStreakStats | null;
  weekDays: WeekDay[];
  onCheckInToday: () => void;
}

export const MasterStreakCard: React.FC<MasterStreakCardProps> = ({
  stats,
  weekDays,
  onCheckInToday,
}) => {
  return (
    <div className="lg:col-span-8 neu-card p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#549acb]" />
            <h2 className="text-base font-extrabold text-[#1a1c35]">Master Streak</h2>
          </div>

          {stats?.activeToday ? (
            <div className="neu-badge px-3 py-1.5 rounded-xl bg-emerald-100/80 text-emerald-700 font-extrabold text-xs flex items-center space-x-1.5 border border-emerald-300/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Checked In Today!</span>
            </div>
          ) : (
            <button
              onClick={onCheckInToday}
              className="neu-button-primary px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Check In Today</span>
            </button>
          )}
        </div>

        {/* 7 Day Boxes (Monday -> Sunday) */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 my-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl transition-all ${
                day.isToday
                  ? 'neu-button border-2 border-[#549acb] bg-sky-50/50 shadow-md scale-105 z-10'
                  : 'neu-card bg-[#E0E5EC]'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-bold text-[#717699] uppercase">
                {day.dayName}
              </span>

              <div className="my-2">
                {day.isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-[#549acb] text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full neu-inset flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#717699]/30" />
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-extrabold ${
                  day.isToday ? 'text-[#549acb]' : 'text-[#44476A]'
                }`}
              >
                {day.dateNum}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-white/50 flex items-center justify-between neu-inset px-4 py-3 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-base">🔥</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#1a1c35]">
            {stats?.masterStreak || 0} Days Current Streak
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-[#717699]">
            Best: {stats?.bestMasterStreak ?? (stats?.masterStreak || 0)} Days
          </span>
        </div>
      </div>
    </div>
  );
};
