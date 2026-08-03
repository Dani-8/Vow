export interface User {
  id: string;
  username: string;
  email: string;
  masterStreak: number;
  longestMasterStreak: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly';
  isPrivate: boolean;
  completedDates: string[];
  currentStreak: number;
  bestStreak: number;
}