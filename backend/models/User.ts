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