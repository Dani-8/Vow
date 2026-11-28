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

export interface IChallengeLog {
    id: string;
    dayNumber: number;
    date: string;
    status: 'completed' | 'rest' | 'missed';
    note: string;
    timeSpent?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface IChallenge {
    _id: string;
    id?: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    color: string;
    icon?: string;
    targetDays: number;
    startDate: string;
    targetEndDate: string;
    rule?: string;
    consequenceOfSkipping?: string;
    consequencesOfSkipping?: string[];
    tags: string[];
    status: 'active' | 'completed' | 'paused';
    logs: IChallengeLog[];
    sprints?: any[];
    currentSprintId?: string;
    isSample?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const inMemoryChallenges: Map<string, any> = new Map();

export class ChallengeInstance implements IChallenge {
    _id: string;
    id?: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    color: string;
    icon?: string;
    targetDays: number;
    startDate: string;
    targetEndDate: string;
    rule?: string;
    consequenceOfSkipping?: string;
    consequencesOfSkipping?: string[];
    tags: string[];
    status: 'active' | 'completed' | 'paused';
