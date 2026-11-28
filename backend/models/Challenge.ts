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
