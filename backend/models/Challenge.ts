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
    tags: string[];
    status: 'active' | 'completed' | 'paused';
    logs: IChallengeLog[];
    sprints?: any[];
    currentSprintId?: string;
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
    tags: string[];
    status: 'active' | 'completed' | 'paused';
    logs: IChallengeLog[];
    sprints?: any[];
    currentSprintId?: string;
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
        this.tags = Array.isArray(data.tags) ? data.tags : [];
        this.status = data.status || 'active';
        this.logs = Array.isArray(data.logs) ? data.logs : [];
        this.sprints = Array.isArray(data.sprints) ? data.sprints : [];
        this.currentSprintId = data.currentSprintId || (this.sprints.length > 0 ? this.sprints[0].id : undefined);
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toObject(): IChallenge {
        return {
            _id: this._id,
            id: this.id || this._id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            category: this.category,
            color: this.color,
            icon: this.icon,
            targetDays: this.targetDays,
            startDate: this.startDate,
            targetEndDate: this.targetEndDate,
            rule: this.rule,
            tags: this.tags,
            status: this.status,
            logs: this.logs,
            sprints: this.sprints,
            currentSprintId: this.currentSprintId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    async save() {
        this.updatedAt = new Date().toISOString();
        const payload = {
            id: this.id || this._id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            category: this.category,
            color: this.color,
            icon: this.icon,
            targetDays: this.targetDays,
            startDate: this.startDate,
            targetEndDate: this.targetEndDate,
            rule: this.rule,
            tags: this.tags,
            status: this.status,
            logs: this.logs,
            sprints: this.sprints || [],
            currentSprintId: this.currentSprintId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db && this._id) {
                    const docRef = doc(db, 'challenges', this._id);
                    await updateDoc(docRef, payload);
                }
            } catch (e) {
                console.warn('Challenge Firestore save fallback to memory:', e);
            }
        }

        inMemoryChallenges.set(this._id, { ...payload, _id: this._id, id: this.id });
        return this;
    }
}

export const Challenge = {
    async find(filter: { userId?: string; status?: string }): Promise<ChallengeInstance[]> {
        const results: ChallengeInstance[] = [];

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const challengesRef = collection(db, 'challenges');
                    let q;
                    if (filter.userId) {
                        q = query(challengesRef, where('userId', '==', String(filter.userId)));
                    } else {
                        q = query(challengesRef);
                    }
                    const snap = await getDocs(q);
                    snap.forEach((d) => {
                        const data = d.data();
                        const obj = new ChallengeInstance({ ...data, _id: d.id, id: data.id || d.id });
                        if (!filter.status || obj.status === filter.status) {
                            results.push(obj);
                        }
                    });
                    return results;
                }
            } catch (e) {
                console.warn('Firestore challenges query failed, using memory store fallback:', e);
            }
        }

        // Fallback to in-memory
        for (const [, val] of inMemoryChallenges) {
            if (!filter.userId || String(val.userId) === String(filter.userId)) {
                if (!filter.status || val.status === filter.status) {
                    results.push(new ChallengeInstance(val));
                }
            }
        }

        return results;
    },

    async findById(id: string): Promise<ChallengeInstance | null> {
        if (!id) return null;
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const docRef = doc(db, 'challenges', id);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        const obj = new ChallengeInstance({ ...data, _id: snap.id, id: data.id || snap.id });
                        inMemoryChallenges.set(obj._id, obj.toObject());
                        return obj;
                    }
                }
            } catch (e) {
                // Memory fallback
            }
        }

        const mem = inMemoryChallenges.get(id);
        if (mem) {
            return new ChallengeInstance(mem);
        }
        for (const [, val] of inMemoryChallenges) {
            if (val.id === id || val._id === id) {
                return new ChallengeInstance(val);
            }
        }
        return null;
    },

    async findOne(filter: { _id?: string; id?: string; userId?: string }): Promise<ChallengeInstance | null> {
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

        const challenges = await this.find(filter);
        return challenges.length > 0 ? challenges[0] : null;
    },

    async create(data: Partial<IChallenge> | any): Promise<any> {
        const now = new Date().toISOString();
        const explicitId = data.id || data._id;
        const targetDays = Number(data.targetDays) || 30;
        const startDate = data.startDate || now;
        const targetEndDate = data.targetEndDate || new Date(new Date(startDate).getTime() + targetDays * 86400000).toISOString();

        const payload = {
            id: explicitId || `ch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: String(data.userId || ''),
            title: data.title || 'Untitled Challenge',
            description: data.description || '',
            category: data.category || 'engineering',
            color: data.color || 'purple',
            icon: data.icon || 'target',
            targetDays,
            startDate,
            targetEndDate,
            rule: data.rule || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            status: data.status || 'active',
            logs: Array.isArray(data.logs) ? data.logs : [],
            createdAt: now,
            updatedAt: now,
        };

        let newId = explicitId || payload.id;
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const challengesRef = collection(db, 'challenges');
                    const docRef = await addDoc(challengesRef, payload);
                    newId = docRef.id;
                }
            } catch (e) {
                // Memory fallback
            }
        }

        const challengeObj = { ...payload, _id: newId, id: payload.id || newId };
        inMemoryChallenges.set(newId, challengeObj);
        return new ChallengeInstance(challengeObj);
    },

    async deleteOne(filter: { _id?: string; id?: string; userId?: string }): Promise<void> {
        const idToDelete = filter._id || filter.id;
        if (!idToDelete) return;

        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const docRef = doc(db, 'challenges', idToDelete);
                    await deleteDoc(docRef);
                }
            } catch (e) {
                // Memory fallback
            }
        }

        inMemoryChallenges.delete(idToDelete);
        for (const [k, v] of inMemoryChallenges) {
            if (v.id === idToDelete || v._id === idToDelete) {
                inMemoryChallenges.delete(k);
            }
        }
    },
};
