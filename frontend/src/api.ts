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
