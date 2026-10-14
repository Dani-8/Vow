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