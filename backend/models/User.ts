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

const inMemoryUsers: Map<string, any> = new Map();

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
    this.updatedAt = new Date().toISOString();
    try {
      const userRef = doc(db, 'users', this._id);
      await updateDoc(userRef, {
        email: this.email,
        passwordHash: this.passwordHash,
        name: this.name,
        pinHash: this.pinHash || null,
        updatedAt: this.updatedAt,
      });
    } catch (e) {
      console.warn('Firestore User.save fallback to in-memory store');
    }
    inMemoryUsers.set(this._id, this.toObject());
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
      try {
        const q = query(collection(db, 'users'), where('email', '==', filter.email.toLowerCase()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          const obj = new UserInstance({ ...docData, _id: snap.docs[0].id });
          inMemoryUsers.set(obj._id, obj.toObject());
          return obj;
        }
      } catch (e) {
        // Fall back to memory
      }
      for (const u of inMemoryUsers.values()) {
        if (u.email && u.email.toLowerCase() === filter.email.toLowerCase()) {
          return new UserInstance(u);
        }
      }
    }
    return null;
  },

  async findById(id: string) {
    if (!id) return null;
    try {
      const docRef = doc(db, 'users', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const obj = new UserInstance({ ...snap.data(), _id: snap.id });
        inMemoryUsers.set(obj._id, obj.toObject());
        return obj;
      }
    } catch (e) {
      // Fall back to memory
    }
    const mem = inMemoryUsers.get(id);
    return mem ? new UserInstance(mem) : null;
  },

  async create(data: Partial<IUser>) {
    const now = new Date().toISOString();
    const payload = {
      email: data.email?.toLowerCase() || '',
      passwordHash: data.passwordHash || '',
      name: data.name || 'Growth Seeker',
      pinHash: data.pinHash || null,
      createdAt: now,
      updatedAt: now,
    };
    let newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    try {
      const usersRef = collection(db, 'users');
      const docRef = await addDoc(usersRef, payload);
      newId = docRef.id;
    } catch (e) {
      // Memory store fallback
    }
    const userObj = { ...payload, _id: newId };
    inMemoryUsers.set(newId, userObj);
    return new UserInstance(userObj);
  },

  async countDocuments() {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.size;
    } catch (e) {
      return inMemoryUsers.size;
    }
  },
};
