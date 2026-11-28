import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
} from 'firebase/firestore';
import { getFirebaseDb, isFirestoreActive } from '../db.js';

export interface ITask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    consequenceOfSkipping?: string;
    consequencesOfSkipping?: string[];
    tags: string[];
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    status: 'todo' | 'in_progress' | 'completed';
    priority?: 'High' | 'Medium' | 'Low';
    isPrivate: boolean;
    isHabit: boolean;
    isSample?: boolean;
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate?: Date | string | null;
    completionHistory: (Date | string)[];
    subTasks?: any[];
    stickyNotes?: any[];
    createdAt?: string;
    updatedAt?: string;
}

const inMemoryTasks: Map<string, any> = new Map();

export class TaskInstance implements ITask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    consequenceOfSkipping?: string;
    consequencesOfSkipping?: string[];
    tags: string[];
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    status: 'todo' | 'in_progress' | 'completed';
    priority?: 'High' | 'Medium' | 'Low';
    isPrivate: boolean;
    isHabit: boolean;
    isSample?: boolean;
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate?: Date | string | null;
    completionHistory: (Date | string)[];
    subTasks?: any[];
    stickyNotes?: any[];
    createdAt?: string;
    updatedAt?: string;

    constructor(data: any) {
        this._id = data._id || data.id || '';
        this.userId = String(data.userId || '');
        this.title = data.title || '';
        this.description = data.description || '';
        this.consequenceOfSkipping = data.consequenceOfSkipping || '';
        this.consequencesOfSkipping = Array.isArray(data.consequencesOfSkipping)
            ? data.consequencesOfSkipping
            : (data.consequenceOfSkipping ? [data.consequenceOfSkipping] : []);
        this.tags = Array.isArray(data.tags) ? data.tags : [];
        this.startTime = data.startTime ? new Date(data.startTime) : null;
        this.endTime = data.endTime ? new Date(data.endTime) : null;
        this.status = data.status || 'todo';
        this.priority = data.priority || 'Medium';
        this.isPrivate = !!data.isPrivate;
        this.isHabit = !!data.isHabit;
        this.isSample = !!data.isSample;
        this.currentStreak = Number(data.currentStreak || 0);
        this.bestStreak = Number(data.bestStreak || 0);
        this.lastCompletedDate = data.lastCompletedDate ? new Date(data.lastCompletedDate) : null;
        this.completionHistory = Array.isArray(data.completionHistory)
            ? data.completionHistory.map((d: any) => new Date(d))
            : [];
        this.subTasks = Array.isArray(data.subTasks) ? data.subTasks : [];
        this.stickyNotes = Array.isArray(data.stickyNotes) ? data.stickyNotes : [];
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
