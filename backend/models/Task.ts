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

