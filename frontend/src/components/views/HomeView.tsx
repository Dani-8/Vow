import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Sparkles,
  Target,
  ArrowUpRight,
  Calendar,
  Check,
  Zap,
} from 'lucide-react';
import { Task, MasterStreakStats } from '../../types';

interface HomeViewProps {
  tasks: Task[];
  stats: MasterStreakStats | null;
  onToggleComplete: (task: Task) => void;
  onCheckInToday: () => void;
  onOpenCreateModal: () => void;
  onOpenAIAssist: (task?: Task) => void;
  onViewTaskDetail: (task: Task) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tasks,
  stats,
  onToggleComplete,
  onCheckInToday,
  onOpenCreateModal,
  onOpenAIAssist,
  onViewTaskDetail,
}) => {
  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedHoursMinutes = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedDayName = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  // Calculate Monday -> Sunday for Current Week
  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
    const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const monDate = new Date(today);
    monDate.setDate(today.getDate() + distToMon);

    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monDate);
      d.setDate(monDate.getDate() + i);

      const dateISO = d.toISOString().split('T')[0];
      const isToday = d.toDateString() === today.toDateString();
      const isFuture = d > today && !isToday;

      // Check if user completed any task or checked in on this date
      const isCompleted =
        (stats?.completedDaysSet && stats.completedDaysSet.includes(dateISO)) ||
        tasks.some((t) =>
          t.completionHistory?.some((hist) => {
            const histISO = new Date(hist).toISOString().split('T')[0];
            return histISO === dateISO;
          })
        ) ||
        (isToday && stats?.activeToday);

      weekDays.push({
        dayName: dayNames[i],
        dateNum: d.getDate(),
        fullDateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateISO,
        isToday,
        isFuture,
        isCompleted: !!isCompleted,
      });
    }

    return weekDays;
  };

  const weekDays = getCurrentWeekDays();

  // Filter Today's Tasks
  const todayTasks = tasks.slice(0, 5); // Main active tasks scheduled for today
  const completedTodayCount = todayTasks.filter((t) => t.status === 'completed').length;
  const remainingTodayCount = todayTasks.length - completedTodayCount;
  const progressPercent =
    todayTasks.length > 0 ? Math.round((completedTodayCount / todayTasks.length) * 100) : 0;

  // Top Focus items (1-3)
  const focusTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 3);

  // If tasks are fewer than 3, fallback demo priorities
  const defaultFocusItems = [
    {
      _id: 'focus-1',
      title: 'Draft Q3 Personal Growth Blueprint',
      tag: 'IMPORTANT',
      tagColor: 'bg-rose-100 text-rose-700',
    },
    {
      _id: 'focus-2',
      title: 'Read 20 pages of "Atomic Habits"',
      tag: 'GROWTH',
      tagColor: 'bg-sky-100 text-sky-700',
    },
    {
      _id: 'focus-3',
      title: '30-minute Morning Focus Meditation',
      tag: 'WELLNESS',
      tagColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const focusList =
    focusTasks.length > 0
      ? focusTasks.map((t, idx) => ({
          _id: t._id,
          title: t.title,
          tag: t.priority === 'High' ? 'IMPORTANT' : t.tags[0] || 'FOCUS',
          tagColor:
            idx === 0
              ? 'bg-rose-100 text-rose-700'
              : idx === 1
              ? 'bg-sky-100 text-sky-700'
              : 'bg-emerald-100 text-emerald-700',
          originalTask: t,
        }))
      : defaultFocusItems.map((item) => ({ ...item, originalTask: null }));

  return (
    <div className="space-y-6 pb-8">
      {/* TOP ROW: Digital Clock & Master Streak Current Week */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DIGITAL CLOCK CARD */}
        <div className="lg:col-span-4 neu-card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-[#647196] mb-3">
            Current Time
          </span>

          {/* Perfect Neumorphic Double-Ring Circular Clock Face */}
          <div className="w-48 h-48 rounded-full bg-[#E0E5EC] p-3.5 flex items-center justify-center shadow-[8px_8px_18px_rgba(163,177,198,0.65),-8px_-8px_18px_rgba(255,255,255,0.85)] border border-white/60 relative my-1">
            <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_7px_7px_14px_rgba(163,177,198,0.65),inset_-7px_-7px_14px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#29335a] tracking-wider font-mono">
                {formattedHoursMinutes}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm font-bold text-[#29335a]">{formattedDate}</p>
            <p className="text-xs font-semibold text-[#647196]">{formattedDayName}</p>
          </div>
        </div>

        {/* MASTER STREAK — CURRENT WEEK CARD */}
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
                Best: {Math.max(stats?.masterStreak || 0, 12)} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: Today's Focus & Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TODAY'S FOCUS */}
        <div className="lg:col-span-5 neu-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-[#549acb]" />
              <h3 className="text-sm font-extrabold text-[#1a1c35]">Today's Focus</h3>
            </div>
            <p className="text-[11px] text-[#717699] font-medium mb-4">
              Your top priorities for today
            </p>

            <div className="space-y-3">
              {focusList.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => item.originalTask && onViewTaskDetail(item.originalTask)}
                  className="neu-inset p-3 rounded-2xl flex items-center space-x-3 cursor-pointer hover:border-[#549acb] transition-all"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-xs font-bold text-[#1a1c35] truncate flex-1">
                    {item.title}
                  </p>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TODAY'S TASKS */}
        <div className="lg:col-span-7 neu-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#549acb]" />
                <h3 className="text-sm font-extrabold text-[#1a1c35]">Today's Tasks</h3>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full neu-badge text-[#549acb]">
                {todayTasks.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-[#717699] font-medium mb-4">
              Tasks & sub-tasks scheduled for today
            </p>

            <div className="space-y-2.5">
              {todayTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#717699] font-medium neu-inset rounded-2xl p-4">
                  No tasks scheduled for today yet.
                  <button
                    onClick={onOpenCreateModal}
                    className="block mx-auto mt-2 text-[#549acb] font-bold hover:underline"
                  >
                    + Add a Task for Today
                  </button>
                </div>
              ) : (
                todayTasks.map((t, idx) => {
                  const isCompleted = t.status === 'completed';
                  return (
                    <div
                      key={t._id}
                      className="neu-inset p-3 rounded-2xl flex items-center justify-between gap-3 group hover:border-[#549acb] transition-all"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(t);
                          }}
                          className="shrink-0 transition-transform active:scale-95"
                        >
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-[#717699] hover:text-[#549acb]" />
                          )}
                        </button>

                        <span
                          onClick={() => onViewTaskDetail(t)}
                          className={`text-xs font-bold truncate cursor-pointer ${
                            isCompleted ? 'line-through text-[#717699]' : 'text-[#1a1c35]'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>

                        <span className="text-[10px] font-semibold text-[#717699] hidden sm:inline">
                          {idx === 0 ? '09:00 AM' : idx === 1 ? '02:00 PM' : '05:00 PM'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Quick Progress, Upcoming Deadlines, Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODAY'S PROGRESS */}
        <div className="neu-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-[#549acb]" />
              <h3 className="text-sm font-extrabold text-[#1a1c35]">Today's Progress</h3>
            </div>
            <p className="text-[11px] text-[#717699] font-medium mb-4">Quick overview</p>

            <div className="grid grid-cols-3 gap-2">
              <div className="neu-inset p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-base font-black text-[#1a1c35]">
                  {completedTodayCount}
                </span>
                <span className="text-[9px] font-bold text-[#717699]">Completed</span>
              </div>

              <div className="neu-inset p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-1">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <span className="text-base font-black text-[#1a1c35]">
                  {remainingTodayCount}
                </span>
                <span className="text-[9px] font-bold text-[#717699]">Remaining</span>
              </div>

              <div className="neu-inset p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <span className="text-base font-black text-[#1a1c35]">{progressPercent}%</span>
                <span className="text-[9px] font-bold text-[#717699]">Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING DEADLINES */}
        <div className="neu-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#549acb]" />
                <h3 className="text-sm font-extrabold text-[#1a1c35]">Upcoming Deadlines</h3>
              </div>
            </div>
            <p className="text-[11px] text-[#717699] font-medium mb-3">
              Next important due dates
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset">
                <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
                  Design System & Components
                </span>
                <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
                  May 19, 2026
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset">
                <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
                  Build Portfolio Website
                </span>
                <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
                  May 23, 2026
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset">
                <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
                  Final Review & Polish
                </span>
                <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
                  May 25, 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="neu-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-[#549acb]" />
              <h3 className="text-sm font-extrabold text-[#1a1c35]">Quick Actions</h3>
            </div>
            <p className="text-[11px] text-[#717699] font-medium mb-4">Common actions</p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onOpenCreateModal}
                className="neu-button p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-1">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold text-[#1a1c35]">New Task</span>
              </button>

              <button
                onClick={onCheckInToday}
                className="neu-button p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[10px] font-extrabold text-[#1a1c35]">Check In</span>
              </button>

              <button
                onClick={() => onOpenAIAssist()}
                className="neu-button p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold text-[#1a1c35]">Focus Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
