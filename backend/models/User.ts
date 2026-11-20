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
