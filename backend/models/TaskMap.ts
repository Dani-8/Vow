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
        }

        inMemoryTaskMaps.set(this._id, { ...payload, _id: this._id, id: this.id });
        return this;
    }
}

export const TaskMap = {
    async find(filter: { userId?: string }): Promise<TaskMapInstance[]> {
        const results: TaskMapInstance[] = [];

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const mapsRef = collection(db, 'task_maps');
                    let q;
                    if (filter.userId) {
                        q = query(mapsRef, where('userId', '==', String(filter.userId)));
                    } else {
                        q = query(mapsRef);
                    }
                    const snap = await getDocs(q);
                    snap.forEach((d) => {
                        const data = d.data();
                        const obj = new TaskMapInstance({ ...data, _id: d.id, id: data.id || d.id });
                        results.push(obj);
                    });
                    return results;
                }
            } catch (e) {
                console.warn('Firestore task_maps query failed, using memory store fallback:', e);
            }
        }

        // Fallback to in-memory map
        for (const [, val] of inMemoryTaskMaps) {
            if (!filter.userId || String(val.userId) === String(filter.userId)) {
                results.push(new TaskMapInstance(val));
            }
        }

        return results;
    },

    async findById(id: string): Promise<TaskMapInstance | null> {
        if (!id) return null;
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const docRef = doc(db, 'task_maps', id);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        const obj = new TaskMapInstance({ ...data, _id: snap.id, id: data.id || snap.id });
                        inMemoryTaskMaps.set(obj._id, obj.toObject());
                        return obj;
                    }
                    const q = query(collection(db, 'task_maps'), where('id', '==', id));
                    const qSnap = await getDocs(q);
                    if (!qSnap.empty) {
                        const firstDoc = qSnap.docs[0];
                        const data = firstDoc.data();
                        const obj = new TaskMapInstance({ ...data, _id: firstDoc.id, id: data.id || firstDoc.id });
                        inMemoryTaskMaps.set(obj._id, obj.toObject());
                        return obj;
                    }
                }
            } catch (e) {
                // Memory fallback
            }
        }

        const mem = inMemoryTaskMaps.get(id);
        if (mem) {
            return new TaskMapInstance(mem);
        }
        // Also check by id property
        for (const [, val] of inMemoryTaskMaps) {
            if (val.id === id || val._id === id) {
                return new TaskMapInstance(val);
            }
        }
        return null;
    },

    async findOne(filter: { _id?: string; id?: string; userId?: string }): Promise<TaskMapInstance | null> {
        if (filter._id || filter.id) {
            const searchId = filter._id || filter.id;
            const found = await this.findById(searchId!);
            if (found) {
                if (!filter.userId || String(found.userId) === String(filter.userId)) {
                    return found;
                }
            }
            return null;
        }

        const maps = await this.find(filter);
        return maps.length > 0 ? maps[0] : null;
    },

