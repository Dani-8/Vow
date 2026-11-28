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

export interface ITaskMapNode {
    id: string;
    taskId: string;
    subTaskId?: string;
    x: number;
    y: number;
    customTitle?: string;
    customStatus?: 'todo' | 'in_progress' | 'completed';
    customProgress?: number;
}

