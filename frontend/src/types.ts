export type ActiveView = 'home' | 'feed' | 'visible' | 'private' | 'stats' | 'auth' | 'task-detail' | 'landing' | 'task-map' | 'challenges' | 'challenge-detail';

export interface ChallengeLog {
  id: string;
  dayNumber: number;
  date: string;
  status: 'completed' | 'rest' | 'missed';
  note: string;
  timeSpent?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SprintRetrospective {
  completedAt: string;
  summary: string;
  score?: number; // 1 to 5 rating
  keyLearnings?: string;
}

export interface ChallengeSprint {
  id: string;
  phaseNumber: number;
  title: string;
  targetDays: number;
  startDate: string;
  targetEndDate?: string;
  rule?: string;
  consequenceOfSkipping?: string;
  consequencesOfSkipping?: string[];
  status: 'active' | 'completed' | 'paused';
  logs: ChallengeLog[];
  retrospective?: SprintRetrospective;
  createdAt?: string;
  updatedAt?: string;
}