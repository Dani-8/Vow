import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ActiveFocusSession {
    id: string; // unique session id
    sourceType: 'task' | 'challenge';
    sourceId: string; // task._id or challenge._id/id
    sourceTitle: string; // "Refactor DB schema" or "30-Day TypeScript Mastery"
    sourceSubtitle?: string; // e.g. "Day 14 Log" or "Priority: High"
    totalSeconds: number; // e.g. 1500 for 25m
    remainingSeconds: number;
    isRunning: boolean;
    startedAt: string; // ISO date
    completedAt?: string;
    dayNumber?: number; // for challenges
    dateStr?: string; // for challenges
}

export interface CompletedFocusSessionRecord {
    id: string;
    sourceType: 'task' | 'challenge';
    sourceId: string;
    sourceTitle: string;
    durationMinutes: number;
    completedAt: string;
}

export interface StartSessionParams {
    sourceType: 'task' | 'challenge';
    sourceId: string;
    sourceTitle: string;
    sourceSubtitle?: string;
    minutes: number;
    dayNumber?: number;
    dateStr?: string;
}

interface FocusTimerContextValue {
    activeSession: ActiveFocusSession | null;
    startSession: (params: StartSessionParams) => void;
    requestStartSession: (params: StartSessionParams) => void;
    togglePlayPause: () => void;
    resetSession: () => void;
    stopSession: () => void;
    completeSessionEarly: () => void;
    isFinishedModalOpen: boolean;
    closeFinishedModal: () => void;
    justFinishedSession: ActiveFocusSession | null;
    isConflictModalOpen: boolean;
    conflictPendingSession: StartSessionParams | null;
    closeConflictModal: () => void;
    confirmConflictSwitch: () => void;
}

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

const STORAGE_KEY = 'app_universal_focus_timer';
const HISTORY_STORAGE_KEY = 'app_focus_session_history';

// Play pleasant web audio chime on session finish
const playChimeSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        // Chime tone 1
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.8);

        // Chime tone 2 (harmonious fifth)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
        gain2.gain.setValueAtTime(0.25, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 1.2);
    } catch {
        // AudioContext not allowed or not supported; gracefully ignore
    }
};

export const getCompletedFocusSessions = (): CompletedFocusSessionRecord[] => {
    try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

const saveCompletedSessionToHistory = (session: ActiveFocusSession) => {
    try {
        const existing = getCompletedFocusSessions();
        const durationMinutes = Math.max(1, Math.round((session.totalSeconds - session.remainingSeconds) / 60));
        const newRecord: CompletedFocusSessionRecord = {
            id: session.id,
            sourceType: session.sourceType,
            sourceId: session.sourceId,
            sourceTitle: session.sourceTitle,
            durationMinutes,
            completedAt: session.completedAt || new Date().toISOString(),
        };
        const updated = [newRecord, ...existing].slice(0, 100);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save focus session history', e);
    }
};

export const FocusTimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeSession, setActiveSession] = useState<ActiveFocusSession | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as ActiveFocusSession;
            return parsed;
        } catch {
            return null;
        }
    });

    const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
    const [justFinishedSession, setJustFinishedSession] = useState<ActiveFocusSession | null>(null);

    // Conflict state
    const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
    const [conflictPendingSession, setConflictPendingSession] = useState<StartSessionParams | null>(null);

    // Persist to local storage
    useEffect(() => {
        try {
            if (activeSession) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) {
            console.error('Failed to sync timer to local storage', e);
        }
    }, [activeSession]);
