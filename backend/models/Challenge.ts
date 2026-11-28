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
    logs: IChallengeLog[];
    sprints?: any[];
    currentSprintId?: string;
    isSample?: boolean;
    createdAt?: string;
    updatedAt?: string;

    constructor(data: any) {
        this._id = data._id || data.id || `ch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.id = data.id || this._id;
        this.userId = String(data.userId || '');
        this.title = data.title || 'Untitled Challenge';
        this.description = data.description || '';
        this.category = data.category || 'engineering';
        this.color = data.color || 'purple';
        this.icon = data.icon || 'target';
        this.targetDays = Number(data.targetDays) || 30;
        this.startDate = data.startDate || new Date().toISOString();
        this.targetEndDate = data.targetEndDate || new Date(Date.now() + this.targetDays * 86400000).toISOString();
        this.rule = data.rule || '';
        this.consequenceOfSkipping = data.consequenceOfSkipping || '';
