import { Task, User, MasterStreakStats } from './types';

const TOKEN_KEY = 'vow_auth_token';
const PRIVATE_PIN_KEY = 'vow_private_pin';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredPin(): string | null {
  return sessionStorage.getItem(PRIVATE_PIN_KEY);
}

export function storePin(pin: string) {
  sessionStorage.setItem(PRIVATE_PIN_KEY, pin);
}

export function clearStoredPin() {
  sessionStorage.removeItem(PRIVATE_PIN_KEY);
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const pin = getStoredPin();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (pin) {
    headers['x-private-pin'] = pin;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || 'Invalid response from server' };
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `API Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async signup(email: string, password: string, name?: string) {
    const data = await fetchAPI<{ token: string; user: User }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await fetchAPI<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async demoBypass() {
    const data = await fetchAPI<{ token: string; user: User }>('/api/auth/demo-bypass', {
      method: 'POST',
    });
    setToken(data.token);
    return data;
  },

  async getMe() {
    return fetchAPI<{ user: User }>('/api/auth/me');
  },

  async setPin(pin: string) {
    const data = await fetchAPI<{ message: string; hasPinSet: boolean }>('/api/auth/set-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
    storePin(pin);
    return data;
  },

  async verifyPin(pin: string) {
    const data = await fetchAPI<{ success: boolean; message: string }>('/api/auth/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
    if (data.success) {
      storePin(pin);
    }
    return data;
  },

  // Tasks
  async getTasks() {
    return fetchAPI<{ tasks: Task[] }>('/api/tasks');
  },

  async getPrivateTasks(pinInput?: string) {
    const pinToUse = pinInput || getStoredPin();
    if (!pinToUse) {
      throw new Error('PIN authentication required');
    }
    return fetchAPI<{ tasks: Task[] }>('/api/tasks/private-list', {
      method: 'POST',
      headers: {
        'x-private-pin': pinToUse,
      },
    });
  },

  async createTask(taskData: {
    title: string;
    description?: string;
    consequenceOfSkipping?: string;
    consequencesOfSkipping?: string[];
    tags?: string[];
    startTime?: string | null;
    endTime?: string | null;
    isPrivate?: boolean;
    isHabit?: boolean;
  }) {
    return fetchAPI<{ task: Task }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  async updateTask(id: string, updates: Partial<Task>) {
    return fetchAPI<{ task: Task }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleTaskComplete(id: string) {
    return fetchAPI<{ task: Task }>(`/api/tasks/${id}/complete`, {
      method: 'POST',
    });
  },

  async toggleTaskPrivate(id: string) {
    return fetchAPI<{ message: string; task: Task }>(`/api/tasks/${id}/toggle-private`, {
      method: 'POST',
    });
  },

  async deleteTask(id: string) {
    return fetchAPI<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Stats
  async getMasterStats() {
    return fetchAPI<MasterStreakStats>('/api/tasks/stats/master');
  },

  async checkInToday() {
    return fetchAPI<{ message: string; stats: MasterStreakStats }>('/api/tasks/checkin-today', {
      method: 'POST',
    });
  },

  // AI Assist
  async requestAIAssist(payload: {
    taskTitle: string;
    description?: string;
    tags?: string[];
    endTime?: string | null;
    status?: string;
    userMessage?: string;
    chatHistory?: { role: 'user' | 'assistant'; text: string }[];
  }) {
    return fetchAPI<{ reply: string }>('/api/ai/task-assist', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Task Maps (Firestore cloud persistence)
  async getTaskMaps() {
    return fetchAPI<{ maps: any[] }>('/api/task-maps');
  },

  async getTaskMap(id: string) {
    return fetchAPI<{ map: any }>(`/api/task-maps/${id}`);
  },

  async createTaskMap(mapData: any) {
    return fetchAPI<{ map: any }>('/api/task-maps', {
      method: 'POST',
      body: JSON.stringify(mapData),
    });
  },

  async updateTaskMap(id: string, updates: any) {
    return fetchAPI<{ map: any }>(`/api/task-maps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async bulkSyncTaskMaps(maps: any[]) {
    return fetchAPI<{ maps: any[]; success: boolean }>('/api/task-maps/bulk-sync', {
      method: 'POST',
      body: JSON.stringify({ maps }),
    });
  },

  async deleteTaskMap(id: string) {
    return fetchAPI<{ success: boolean; message: string }>(`/api/task-maps/${id}`, {
      method: 'DELETE',
    });
  },

  // Challenges (N-day Target Challenges & Habits)
  async getChallenges() {
    return fetchAPI<{ challenges: any[] }>('/api/challenges');
  },

  async getChallenge(id: string) {
    return fetchAPI<{ challenge: any }>(`/api/challenges/${id}`);
  },

  async createChallenge(challengeData: any) {
    return fetchAPI<{ challenge: any }>('/api/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  },

  async updateChallenge(id: string, updates: any) {
    return fetchAPI<{ challenge: any }>(`/api/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async logChallengeDay(id: string, logData: {
    dayNumber: number;
    date?: string;
    status?: 'completed' | 'rest' | 'missed';
    note?: string;
    timeSpent?: string;
    imageUrl?: string;
    sprintId?: string;
  }) {
    return fetchAPI<{ challenge: any; log: any }>(`/api/challenges/${id}/log`, {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  },

  async deleteChallengeLog(id: string, logId: string) {
    return fetchAPI<{ challenge: any }>(`/api/challenges/${id}/log/${logId}`, {
      method: 'DELETE',
    });
  },

  async deleteChallenge(id: string) {
    return fetchAPI<{ success: boolean }>(`/api/challenges/${id}`, {
      method: 'DELETE',
    });
  },
};
