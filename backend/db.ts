import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let dbInstance: any = null;
let isConfigValid = false;

export function getFirebaseDb() {
    if (dbInstance && isConfigValid) return dbInstance;

    let config: any = {};
    try {
        const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }
    } catch (e) {
        console.warn('Could not load firebase-applet-config.json:', e);
    }

    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY || config.apiKey,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || config.authDomain,
        projectId: process.env.FIREBASE_PROJECT_ID || config.projectId,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || config.storageBucket,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
        appId: process.env.FIREBASE_APP_ID || config.appId,
    };

    try {
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
            isConfigValid = false;
            return null;
        }
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        dbInstance = config.firestoreDatabaseId
            ? getFirestore(app, config.firestoreDatabaseId)
            : getFirestore(app);
        isConfigValid = true;
        return dbInstance;
    } catch (e) {
        console.warn('Firebase initialization failed (using in-memory store):', e);
        isConfigValid = false;
        return null;
    }
}

export function isFirestoreActive(): boolean {
    return isConfigValid && !!dbInstance;
}

export const db = getFirebaseDb();

export async function connectDB(): Promise<string> {
    const activeDb = getFirebaseDb();
    if (activeDb) {
        console.log('Connected to Firebase Firestore database');
        return 'firestore';
    } else {
        console.log('Using robust in-memory database store');
        return 'in-memory';
    }
}

export async function disconnectDB() {
    console.log('Disconnected database connection');
}

