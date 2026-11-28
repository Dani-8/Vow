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

    async save() {
        if (!this._id) {
            throw new Error('Task ID missing for save');
        }
        this.updatedAt = new Date().toISOString();

        const payload = {
            userId: String(this.userId),
            title: this.title,
            description: this.description || '',
            consequenceOfSkipping: this.consequenceOfSkipping || (this.consequencesOfSkipping && this.consequencesOfSkipping[0]) || '',
            consequencesOfSkipping: this.consequencesOfSkipping || [],
            tags: this.tags || [],
            startTime: this.startTime ? new Date(this.startTime).toISOString() : null,
            endTime: this.endTime ? new Date(this.endTime).toISOString() : null,
            status: this.status,
            priority: this.priority || 'Medium',
            isPrivate: this.isPrivate,
            isHabit: this.isHabit,
            isSample: !!this.isSample,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            lastCompletedDate: this.lastCompletedDate ? new Date(this.lastCompletedDate).toISOString() : null,
            completionHistory: this.completionHistory.map((d) => new Date(d).toISOString()),
            subTasks: this.subTasks || [],
            stickyNotes: this.stickyNotes || [],
            updatedAt: this.updatedAt,
        };

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const taskRef = doc(db, 'tasks', this._id);
                    await updateDoc(taskRef, payload);
                }
            } catch (e) {
                // Memory store fallback
            }
        }

        inMemoryTasks.set(this._id, this.toObject());
        return this;
    }

    toObject() {
        return {
            _id: this._id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            consequenceOfSkipping: this.consequenceOfSkipping,
            consequencesOfSkipping: this.consequencesOfSkipping,
            tags: this.tags,
            startTime: this.startTime ? new Date(this.startTime).toISOString() : null,
            endTime: this.endTime ? new Date(this.endTime).toISOString() : null,
            status: this.status,
            priority: this.priority || 'Medium',
            isPrivate: this.isPrivate,
            isHabit: this.isHabit,
            isSample: !!this.isSample,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            lastCompletedDate: this.lastCompletedDate ? new Date(this.lastCompletedDate).toISOString() : null,
            completionHistory: this.completionHistory.map((d) => new Date(d).toISOString()),
            subTasks: this.subTasks || [],
            stickyNotes: this.stickyNotes || [],
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export const Task = {
    async find(filter: { userId?: string; isPrivate?: boolean; isHabit?: boolean; title?: string }) {
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const qConstraints: any[] = [];
                    if (filter.userId) qConstraints.push(where('userId', '==', String(filter.userId)));
                    if (filter.isPrivate !== undefined) qConstraints.push(where('isPrivate', '==', filter.isPrivate));
                    if (filter.isHabit !== undefined) qConstraints.push(where('isHabit', '==', filter.isHabit));
                    if (filter.title !== undefined) qConstraints.push(where('title', '==', filter.title));

                    const q = query(collection(db, 'tasks'), ...qConstraints);
                    const snap = await getDocs(q);
                    const results: TaskInstance[] = [];
                    snap.forEach((docSnap) => {
                        const obj = new TaskInstance({ ...docSnap.data(), _id: docSnap.id });
                        inMemoryTasks.set(obj._id, obj.toObject());
                        results.push(obj);
                    });

                    results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                    return results;
                }
            } catch (e) {
                // Memory fallback
            }
        }

        // Memory fallback
        let filtered = Array.from(inMemoryTasks.values());
        if (filter.userId) filtered = filtered.filter((t) => String(t.userId) === String(filter.userId));
        if (filter.isPrivate !== undefined) filtered = filtered.filter((t) => !!t.isPrivate === filter.isPrivate);
        if (filter.isHabit !== undefined) filtered = filtered.filter((t) => !!t.isHabit === filter.isHabit);
        if (filter.title !== undefined) filtered = filtered.filter((t) => t.title === filter.title);

        const results = filtered.map((t) => new TaskInstance(t));
        results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        return results;
    },
