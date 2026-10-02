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