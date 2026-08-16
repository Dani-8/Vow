export type ActiveView = 'home' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail' | 'landing' | 'task-map';

export interface User {
  id: string;
  email: string;
  name: string;
  hasPinSet: boolean;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  dateLabel: string; // e.g. "Aug 14", "Aug 15"
  dueDate?: string; // e.g. "Aug 17, 2026"
  timeLeft?: string; // e.g. "Today", "2 days", "1h 34m"
  status: 'completed' | 'in_progress' | 'pending';
  priority?: 'High' | 'Medium' | 'Low';
  assignee?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  masterStreak?: string;
  attachments?: {
    name: string;
    size: string;
    type?: string;
    url?: string;
  }[];
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
  priority?: 'High' | 'Medium' | 'Low';
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
  subTasks?: SubTask[];
}

export interface MasterStreakStats {
  masterStreak: number;
  bestMasterStreak?: number;
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
