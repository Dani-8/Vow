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
    color: string;
    isPrimary?: boolean;
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
    color: string;
    isPrimary?: boolean;
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
        this.color = data.color || 'purple';
        this.isPrimary = !!data.isPrimary;
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
            color: this.color,
            isPrimary: this.isPrimary,
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
            color: this.color,
            isPrimary: this.isPrimary,
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

    async create(data: Partial<ITaskMap>): Promise<TaskMapInstance> {
        const now = new Date().toISOString();
        const explicitId = data.id || data._id;
        const payload = {
            id: explicitId || `map_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: String(data.userId || ''),
            name: data.name || 'Untitled Map',
            description: data.description || '',
            color: data.color || 'purple',
            isPrimary: !!data.isPrimary,
            nodes: Array.isArray(data.nodes) ? data.nodes : [],
            connections: Array.isArray(data.connections) ? data.connections : [],
            createdAt: now,
            updatedAt: now,
        };

        let newId = explicitId || payload.id;
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const mapsRef = collection(db, 'task_maps');
                    const docRef = await addDoc(mapsRef, payload);
                    newId = docRef.id;
                }
            } catch (e) {
                // Memory store fallback
            }
        }

        const mapObj = { ...payload, _id: newId, id: payload.id || newId };
        inMemoryTaskMaps.set(newId, mapObj);
        return new TaskMapInstance(mapObj);
    },

    async deleteOne(filter: { _id?: string; id?: string; userId?: string }): Promise<void> {
        const idToDelete = filter._id || filter.id;
        if (!idToDelete) return;

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const docRef = doc(db, 'task_maps', idToDelete);
                    await deleteDoc(docRef);
                }
            } catch (e) {
                // Memory fallback
            }
        }

        inMemoryTaskMaps.delete(idToDelete);
        for (const [k, v] of inMemoryTaskMaps) {
            if (v.id === idToDelete || v._id === idToDelete) {
                inMemoryTaskMaps.delete(k);
            }
        }
    },
};
