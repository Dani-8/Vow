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

export class TaskMapInstance implements ITaskMap {
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

    constructor(data: any) {
        this._id = data._id || data.id || '';
        this.id = data.id || this._id;
        this.userId = String(data.userId || '');
        this.name = data.name || '';
        this.description = data.description || '';
        this.category = data.category || '';
        this.icon = data.icon || '';
        this.color = data.color || 'purple';
        this.isPrimary = !!data.isPrimary;
        this.isSample = !!data.isSample;
        this.nodes = Array.isArray(data.nodes) ? data.nodes : [];
        this.connections = Array.isArray(data.connections) ? data.connections : [];
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toObject(): ITaskMap {
        return {
            _id: this._id,
            id: this.id || this._id,
            userId: this.userId,
            name: this.name,
            description: this.description,
            category: this.category,
            icon: this.icon,
            color: this.color,
            isPrimary: this.isPrimary,
            isSample: this.isSample,
            nodes: this.nodes,
            connections: this.connections,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    async save(): Promise<TaskMapInstance> {
        this.updatedAt = new Date().toISOString();
        const payload = {
            userId: this.userId,
            name: this.name,
            description: this.description,
            category: this.category || '',
            icon: this.icon || '',
            color: this.color,
            isPrimary: this.isPrimary,
            isSample: !!this.isSample,
            nodes: this.nodes,
            connections: this.connections,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db && this._id) {
                    const docRef = doc(db, 'task_maps', this._id);
                    await updateDoc(docRef, payload);
                }
            } catch (e) {
                console.warn('TaskMap Firestore save fallback to memory:', e);
            }
