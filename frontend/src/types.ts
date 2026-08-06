export interface User {
  id: string;
  email: string;
  name: string;
  hasPinSet: boolean;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  tags: string[];
  startTime?: string | null;
  endTime?: string | null;
  status: 'todo' | 'in_progress' | 'completed';
  isPrivate: boolean;
  isHabit: boolean;
  currentStreak: number;
  bestStreak: number;
  effectiveCurrentStreak?: number;
  effectiveBestStreak?: number;
  completedToday?: boolean;
  missedPreviousDays?: boolean;
  lastCompletedDate?: string | null;
  completionHistory?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MasterStreakStats {
  masterStreak: number;
  activeToday: boolean;
  totalCheckIns: number;
  completedDaysSet: string[];
  totalTasks: number;
  totalHabits: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
