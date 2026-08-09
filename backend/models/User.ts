import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../db.js';

export interface IUser {
    _id: string;
    email: string;
    passwordHash: string;
    name: string;
    pinHash?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export class UserInstance implements IUser {
    _id: string;
    email: string;
    passwordHash: string;
    name: string;
    pinHash?: string | null;
    createdAt?: string;
    updatedAt?: string;

    constructor(data: any) {
        this._id = data._id || data.id || '';
        this.email = data.email || '';
        this.passwordHash = data.passwordHash || '';
        this.name = data.name || '';
        this.pinHash = data.pinHash || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    async save() {
        if (!this._id) {
            throw new Error('User ID missing for save');
        }
        const userRef = doc(db, 'users', this._id);
        this.updatedAt = new Date().toISOString();
        await updateDoc(userRef, {
            email: this.email,
            passwordHash: this.passwordHash,
            name: this.name,
            pinHash: this.pinHash || null,
            updatedAt: this.updatedAt,
        });
        return this;
    }

    toObject() {
        return {
            _id: this._id,
            email: this.email,
            passwordHash: this.passwordHash,
            name: this.name,
            pinHash: this.pinHash,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export const User = {
    async findOne(filter: { email?: string; _id?: string }) {
        if (filter._id) {
            return this.findById(filter._id);
        }
        if (filter.email) {
            const q = query(collection(db, 'users'), where('email', '==', filter.email.toLowerCase()));
            const snap = await getDocs(q);
            if (snap.empty) return null;
            const docData = snap.docs[0].data();
            return new UserInstance({ ...docData, _id: snap.docs[0].id });
        }
        return null;
    },

    async findById(id: string) {
        if (!id) return null;
        const docRef = doc(db, 'users', id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return null;
        return new UserInstance({ ...snap.data(), _id: snap.id });
    },

    async create(data: Partial<IUser>) {
        const usersRef = collection(db, 'users');
        const now = new Date().toISOString();
        const payload = {
            email: data.email?.toLowerCase() || '',
            passwordHash: data.passwordHash || '',
            name: data.name || 'Growth Seeker',
            pinHash: data.pinHash || null,
            createdAt: now,
            updatedAt: now,
        };
        const docRef = await addDoc(usersRef, payload);
        return new UserInstance({ ...payload, _id: docRef.id });
    },

    async countDocuments() {
        const snap = await getDocs(collection(db, 'users'));
        return snap.size;
    },
};
