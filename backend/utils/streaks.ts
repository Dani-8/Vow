import { ITask } from '../models/Task.js';

export function getFormattedDateString(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates effective current streak for a task considering missed days.
 */
export function calculateTaskEffectiveStreak(task: ITask): {
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  missedPreviousDays: boolean;
} {
  const now = new Date();
  const todayStr = getFormattedDateString(now);

  if (!task.lastCompletedDate) {
    return {
      currentStreak: 0,
      bestStreak: task.bestStreak || 0,
      completedToday: false,
      missedPreviousDays: false,
    };
  }

  const lastCompDate = new Date(task.lastCompletedDate);
  const lastCompStr = getFormattedDateString(lastCompDate);
  const daysDiff = getDaysDifference(lastCompDate, now);

  const completedToday = lastCompStr === todayStr;

  let currentStreak = task.currentStreak || 0;
  let missedPreviousDays = false;

  if (!completedToday) {
    if (daysDiff === 1) {
      // Completed yesterday, current streak is alive!
      currentStreak = task.currentStreak || 0;
    } else if (daysDiff > 1) {
      // Missed one or more days -> current streak quietly resets to 0
      currentStreak = 0;
      missedPreviousDays = true;
    }
  }

  const bestStreak = Math.max(task.bestStreak || 0, currentStreak);

  return {
    currentStreak,
    bestStreak,
    completedToday,
    missedPreviousDays,
  };
}

/**
 * Updates task streak when user completes check-in today.
 */
export function registerTaskCompletion(task: ITask): {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: Date;
  alreadyCompletedToday: boolean;
} {
  const now = new Date();
  const todayStr = getFormattedDateString(now);

  if (task.lastCompletedDate) {
    const lastCompStr = getFormattedDateString(new Date(task.lastCompletedDate));
    if (lastCompStr === todayStr && task.status === 'completed') {
      return {
        currentStreak: task.currentStreak,
        bestStreak: task.bestStreak,
        lastCompletedDate: task.lastCompletedDate,
        alreadyCompletedToday: true,
      };
    }
  }

  let newCurrentStreak = 1;
  if (task.lastCompletedDate) {
    const daysDiff = getDaysDifference(new Date(task.lastCompletedDate), now);
    if (daysDiff === 1) {
      // Consecutive day!
      newCurrentStreak = (task.currentStreak || 0) + 1;
    } else if (daysDiff === 0) {
      newCurrentStreak = Math.max(1, task.currentStreak || 1);
    } else {
      // Reset streak quietly to 1 for today
      newCurrentStreak = 1;
    }
  }

  const newBestStreak = Math.max(task.bestStreak || 0, newCurrentStreak);

  return {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastCompletedDate: now,
    alreadyCompletedToday: false,
  };
}

/**
 * Computes master streak across all tasks and habits of the user
 * derived dynamically from completion dates.
 */
export function calculateMasterStreak(tasks: ITask[]): {
  masterStreak: number;
  bestMasterStreak: number;
  activeToday: boolean;
  totalCheckIns: number;
  completedDaysSet: string[];
} {
  const now = new Date();
  const todayStr = getFormattedDateString(now);

  // Collect all unique completion YYYY-MM-DD dates across all tasks/habits
  const dateSet = new Set<string>();

  tasks.forEach((t) => {
    if (t.completionHistory && t.completionHistory.length > 0) {
      t.completionHistory.forEach((date) => {
        dateSet.add(getFormattedDateString(new Date(date)));
      });
    } else if (t.lastCompletedDate) {
      dateSet.add(getFormattedDateString(new Date(t.lastCompletedDate)));
    }
  });

  const activeToday = dateSet.has(todayStr);

  let masterStreak = 0;
  let checkDate = new Date(now);

  // If not completed today yet, start checking from yesterday to see if streak is still active
  if (!activeToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const checkStr = getFormattedDateString(checkDate);
    if (dateSet.has(checkStr)) {
      masterStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best master streak from sorted dates or task records
  let bestMasterStreak = masterStreak;
  const sortedDates = Array.from(dateSet).sort();
  if (sortedDates.length > 0) {
    let currentConsecutive = 0;
    let maxConsecutive = 0;
    let prevDate: Date | null = null;

    for (const dStr of sortedDates) {
      const d = new Date(dStr);
      if (!prevDate) {
        currentConsecutive = 1;
      } else {
        const diff = getDaysDifference(prevDate, d);
        if (diff === 1) {
          currentConsecutive++;
        } else if (diff > 1) {
          currentConsecutive = 1;
        }
      }
      if (currentConsecutive > maxConsecutive) {
        maxConsecutive = currentConsecutive;
      }
      prevDate = d;
    }
    bestMasterStreak = Math.max(maxConsecutive, masterStreak);
  }

  tasks.forEach((t) => {
    if (t.bestStreak && t.bestStreak > bestMasterStreak) {
      bestMasterStreak = t.bestStreak;
    }
  });

  return {
    masterStreak,
    bestMasterStreak,
    activeToday,
    totalCheckIns: dateSet.size,
    completedDaysSet: Array.from(dateSet),
  };
}
