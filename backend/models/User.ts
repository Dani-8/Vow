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
import { getFirebaseDb, isFirestoreActive } from '../db.js';
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
import { getFirebaseDb, isFirestoreActive } from '../db.js';

export class UserInstance implements IUser {
    _id: string;
    username: string;
    email?: string;
    passwordHash: string;
    recoveryKeyHash?: string;
    plainRecoveryKey?: string;
    name: string;
    pinHash?: string | null;
    createdAt?: string;
    updatedAt?: string;

    constructor(data: any) {
        this._id = data._id || data.id || '';
        this.username = (data.username || data.email?.split('@')[0] || 'user').toLowerCase().trim();
        this.email = data.email || '';
        this.passwordHash = data.passwordHash || '';
        this.recoveryKeyHash = data.recoveryKeyHash || '';
        this.plainRecoveryKey = data.plainRecoveryKey || data.recoveryKey || '';
        this.name = data.name || this.username;
        this.pinHash = data.pinHash || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    async save() {
        if (!this._id) {
            throw new Error('User ID missing for save');
        }
        this.updatedAt = new Date().toISOString();
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const userRef = doc(db, 'users', this._id);
                    await updateDoc(userRef, {
                        username: this.username,
                        email: this.email,
                        passwordHash: this.passwordHash,
                        recoveryKeyHash: this.recoveryKeyHash || null,
                        plainRecoveryKey: this.plainRecoveryKey || null,
                        name: this.name,
                        pinHash: this.pinHash || null,
                        updatedAt: this.updatedAt,
                    });
                }
            } catch (e) {
                console.warn('Firestore User.save fallback to in-memory store');
            }
        }
        inMemoryUsers.set(this._id, this.toObject());
        return this;
    }

    toObject() {
        return {
            _id: this._id,
            username: this.username,
            email: this.email,
            passwordHash: this.passwordHash,
            recoveryKeyHash: this.recoveryKeyHash,
            plainRecoveryKey: this.plainRecoveryKey,
            name: this.name,
            pinHash: this.pinHash,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export const User = {
    async findOne(filter: { username?: string; email?: string; _id?: string }) {
        if (filter._id) {
            return this.findById(filter._id);
        }

        const usernameTarget = filter.username?.toLowerCase().trim();
        const emailTarget = filter.email?.toLowerCase().trim();

        // 1. Search by username
        if (usernameTarget) {
            if (isFirestoreActive()) {
                try {
                    const db = getFirebaseDb();
                    if (db) {
                        const q = query(collection(db, 'users'), where('username', '==', usernameTarget));
                        const snap = await getDocs(q);
                        if (!snap.empty) {
                            const docData = snap.docs[0].data();
                            const obj = new UserInstance({ ...docData, _id: snap.docs[0].id });
                            inMemoryUsers.set(obj._id, obj.toObject());
                            return obj;
                        }
                    }
                } catch (e) {
                    // Fall back to memory
                }
            }
            for (const u of inMemoryUsers.values()) {
                if (u.username && u.username.toLowerCase() === usernameTarget) {
                    return new UserInstance(u);
                }
            }
        }

        // 2. Search by email (fallback for older accounts)
        if (emailTarget) {
            if (isFirestoreActive()) {
                try {
                    const db = getFirebaseDb();
                    if (db) {
                        const q = query(collection(db, 'users'), where('email', '==', emailTarget));
                        const snap = await getDocs(q);
                        if (!snap.empty) {
                            const docData = snap.docs[0].data();
                            const obj = new UserInstance({ ...docData, _id: snap.docs[0].id });
                            inMemoryUsers.set(obj._id, obj.toObject());
                            return obj;
                        }
                    }
                } catch (e) {
                    // Fall back to memory
                }
            }
            for (const u of inMemoryUsers.values()) {
                if (u.email && u.email.toLowerCase() === emailTarget) {
                    return new UserInstance(u);
                }
            }
        }

        return null;
    },

    async findById(id: string) {
        if (!id) return null;
        if (isFirestoreActive()) {
            try {
                const db = getFirebaseDb();
                if (db) {
                    const docRef = doc(db, 'users', id);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        const obj = new UserInstance({ ...snap.data(), _id: snap.id });
                        inMemoryUsers.set(obj._id, obj.toObject());
                        return obj;
                    }
                }
            } catch (e) {
                // Fall back to memory
            }
        }
        const mem = inMemoryUsers.get(id);
        return mem ? new UserInstance(mem) : null;
    },