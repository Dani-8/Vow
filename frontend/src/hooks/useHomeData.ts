import { useState, useEffect } from 'react';
import { Task, MasterStreakStats } from '../types';

export interface WeekDay {
  dayName: string;
  dateNum: number;
  fullDateStr: string;
  dateISO: string;
  isToday: boolean;
  isFuture: boolean;
  isCompleted: boolean;
}

export interface FocusItem {
  _id: string;
  title: string;
  tag: string;
  tagColor: string;
  originalTask: Task | null;
}

export function useHomeData(tasks: Task[], stats: MasterStreakStats | null) {
  // Live Digital Clock State
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

  // Current Week Days (Monday -> Sunday)
  const getCurrentWeekDays = (): WeekDay[] => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const monDate = new Date(today);
    monDate.setDate(today.getDate() + distToMon);

    const weekDays: WeekDay[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monDate);
      d.setDate(monDate.getDate() + i);

      const dateISO = d.toISOString().split('T')[0];
      const isToday = d.toDateString() === today.toDateString();
      const isFuture = d > today && !isToday;

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

  // Today's Tasks
  const todayTasks = tasks.slice(0, 5);
  const completedTodayCount = todayTasks.filter((t) => t.status === 'completed').length;
  const remainingTodayCount = todayTasks.length - completedTodayCount;
  const progressPercent =
    todayTasks.length > 0 ? Math.round((completedTodayCount / todayTasks.length) * 100) : 0;

  // Focus Items
  const focusTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 3);

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

  const focusList: FocusItem[] =
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

  return {
    formattedHoursMinutes,
    formattedDate,
    formattedDayName,
    weekDays,
    todayTasks,
    completedTodayCount,
    remainingTodayCount,
    progressPercent,
    focusList,
  };
}
