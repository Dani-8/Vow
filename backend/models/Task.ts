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
import { db } from '../db.js';

export interface ITask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    tags: string[];
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    status: 'todo' | 'in_progress' | 'completed';
    isPrivate: boolean;
    isHabit: boolean;
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate?: Date | string | null;
    completionHistory: (Date | string)[];
    createdAt?: string;
    updatedAt?: string;
}

export class TaskInstance implements ITask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    tags: string[];
    startTime?: Date | string | null;
    endTime?: Date | string | null;
    status: 'todo' | 'in_progress' | 'completed';
    isPrivate: boolean;
    isHabit: boolean;
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate?: Date | string | null;
    completionHistory: (Date | string)[];
    createdAt?: string;
    updatedAt?: string;

    constructor(data: any) {
        this._id = data._id || data.id || '';
        this.userId = String(data.userId || '');
        this.title = data.title || '';
        this.description = data.description || '';
        this.tags = Array.isArray(data.tags) ? data.tags : [];
        this.startTime = data.startTime ? new Date(data.startTime) : null;
        this.endTime = data.endTime ? new Date(data.endTime) : null;
        this.status = data.status || 'todo';
        this.isPrivate = !!data.isPrivate;
        this.isHabit = !!data.isHabit;
        this.currentStreak = Number(data.currentStreak || 0);
        this.bestStreak = Number(data.bestStreak || 0);
        this.lastCompletedDate = data.lastCompletedDate ? new Date(data.lastCompletedDate) : null;
        this.completionHistory = Array.isArray(data.completionHistory)
            ? data.completionHistory.map((d: any) => new Date(d))
            : [];
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    async save() {
        if (!this._id) {
            throw new Error('Task ID missing for save');
        }
        const taskRef = doc(db, 'tasks', this._id);
        this.updatedAt = new Date().toISOString();

        const payload = {
            userId: String(this.userId),
            title: this.title,
            description: this.description || '',
            tags: this.tags || [],
            startTime: this.startTime ? new Date(this.startTime).toISOString() : null,
            endTime: this.endTime ? new Date(this.endTime).toISOString() : null,
            status: this.status,
            isPrivate: this.isPrivate,
            isHabit: this.isHabit,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            lastCompletedDate: this.lastCompletedDate ? new Date(this.lastCompletedDate).toISOString() : null,
            completionHistory: this.completionHistory.map((d) => new Date(d).toISOString()),
            updatedAt: this.updatedAt,
        };

        await updateDoc(taskRef, payload);
        return this;
    }

    toObject() {
        return {
            _id: this._id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            tags: this.tags,
            startTime: this.startTime ? new Date(this.startTime).toISOString() : null,
            endTime: this.endTime ? new Date(this.endTime).toISOString() : null,
            status: this.status,
            isPrivate: this.isPrivate,
            isHabit: this.isHabit,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            lastCompletedDate: this.lastCompletedDate ? new Date(this.lastCompletedDate).toISOString() : null,
            completionHistory: this.completionHistory.map((d) => new Date(d).toISOString()),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export const Task = {
    async find(filter: { userId?: string; isPrivate?: boolean; isHabit?: boolean; title?: string }) {
        const qConstraints: any[] = [];
        if (filter.userId) qConstraints.push(where('userId', '==', String(filter.userId)));
        if (filter.isPrivate !== undefined) qConstraints.push(where('isPrivate', '==', filter.isPrivate));
        if (filter.isHabit !== undefined) qConstraints.push(where('isHabit', '==', filter.isHabit));
        if (filter.title !== undefined) qConstraints.push(where('title', '==', filter.title));

        const q = query(collection(db, 'tasks'), ...qConstraints);
        const snap = await getDocs(q);
        const results: TaskInstance[] = [];
        snap.forEach((docSnap) => {
            results.push(new TaskInstance({ ...docSnap.data(), _id: docSnap.id }));
        });

        results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        return results;
    },

    async findOne(filter: { _id?: string; userId?: string; title?: string; isHabit?: boolean }) {
        if (filter._id) {
            const docRef = doc(db, 'tasks', filter._id);
            const snap = await getDoc(docRef);
            if (!snap.exists()) return null;
            const data = snap.data();
            if (filter.userId && String(data.userId) !== String(filter.userId)) {
                return null;
            }
            return new TaskInstance({ ...data, _id: snap.id });
        }

        const tasks = await this.find(filter);
        return tasks.length > 0 ? tasks[0] : null;
    },

    async create(data: Partial<ITask>) {
        const tasksRef = collection(db, 'tasks');
        const now = new Date().toISOString();
        const payload = {
            userId: String(data.userId || ''),
            title: data.title || '',
            description: data.description || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
            endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
            status: data.status || 'todo',
            isPrivate: !!data.isPrivate,
            isHabit: !!data.isHabit,
            currentStreak: Number(data.currentStreak || 0),
            bestStreak: Number(data.bestStreak || 0),
            lastCompletedDate: data.lastCompletedDate ? new Date(data.lastCompletedDate).toISOString() : null,
            completionHistory: Array.isArray(data.completionHistory)
                ? data.completionHistory.map((d: any) => new Date(d).toISOString())
                : [],
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await addDoc(tasksRef, payload);
        return new TaskInstance({ ...payload, _id: docRef.id });
    },

    async deleteOne(filter: { _id: string }) {
        if (!filter._id) return;
        const docRef = doc(db, 'tasks', filter._id);
        await deleteDoc(docRef);
    },
};
