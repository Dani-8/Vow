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

interface FocusTimerContextValue {
    activeSession: ActiveFocusSession | null;
    startSession: (params: {
        sourceType: 'task' | 'challenge';
        sourceId: string;
        sourceTitle: string;
        sourceSubtitle?: string;
        minutes: number;
        dayNumber?: number;
        dateStr?: string;
    }) => void;
    togglePlayPause: () => void;
    resetSession: () => void;
    stopSession: () => void;
    completeSessionEarly: () => void;
    isFinishedModalOpen: boolean;
    closeFinishedModal: () => void;
    justFinishedSession: ActiveFocusSession | null;
}

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

const STORAGE_KEY = 'app_universal_focus_timer';

export const FocusTimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeSession, setActiveSession] = useState<ActiveFocusSession | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as ActiveFocusSession;
            // If it was running when reloaded, recalculate remaining or keep paused
            return parsed;
        } catch {
            return null;
        }
    });

    const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
    const [justFinishedSession, setJustFinishedSession] = useState<ActiveFocusSession | null>(null);

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

    // Interval countdown
    useEffect(() => {
        if (!activeSession || !activeSession.isRunning) return;

        const timer = setInterval(() => {
            setActiveSession((prev) => {
                if (!prev || !prev.isRunning) return prev;
                if (prev.remainingSeconds <= 1) {
                    clearInterval(timer);
                    const finished = {
                        ...prev,
                        remainingSeconds: 0,
                        isRunning: false,
                        completedAt: new Date().toISOString(),
                    };
                    setJustFinishedSession(finished);
                    setIsFinishedModalOpen(true);
                    return null;
                }
                return {
                    ...prev,
                    remainingSeconds: prev.remainingSeconds - 1,
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeSession?.isRunning]);

    const startSession = useCallback(
        ({
            sourceType,
            sourceId,
            sourceTitle,
            sourceSubtitle,
            minutes,
            dayNumber,
            dateStr,
        }: {
            sourceType: 'task' | 'challenge';
            sourceId: string;
            sourceTitle: string;
            sourceSubtitle?: string;
            minutes: number;
            dayNumber?: number;
            dateStr?: string;
        }) => {
            const totalSec = Math.max(60, Math.round(minutes * 60));
            const newSession: ActiveFocusSession = {
                id: `focus_${Date.now()}`,
                sourceType,
                sourceId,
                sourceTitle,
                sourceSubtitle,
                totalSeconds: totalSec,
                remainingSeconds: totalSec,
                isRunning: true,
                startedAt: new Date().toISOString(),
                dayNumber,
                dateStr,
            };
            setActiveSession(newSession);
        },
        []
    );