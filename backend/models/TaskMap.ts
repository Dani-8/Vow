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

export interface ITaskMapConnection {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    relationship: string;
    isCritical?: boolean;
}

export interface ITaskMap {
    _id: string;
    id?: string;
    userId: string;
    name: string;
    description: string;
    category?: string;
    icon?: string;
    color: string;
    isPrimary?: boolean;
    isSample?: boolean;
    nodes: ITaskMapNode[];
    connections: ITaskMapConnection[];
    createdAt?: string;
    updatedAt?: string;
}

const inMemoryTaskMaps: Map<string, any> = new Map();

