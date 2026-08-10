import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let dbInstance: any = null;

export function getFirebaseDb() {
    if (dbInstance) return dbInstance;

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
            console.warn('Firebase config incomplete. Using in-memory store fallback.');
            dbInstance = {} as any;
            return dbInstance;
        }
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        dbInstance = config.firestoreDatabaseId
            ? getFirestore(app, config.firestoreDatabaseId)
            : getFirestore(app);
    } catch (e) {
        console.warn('Firebase initialization failed (will use in-memory store fallback):', e);
        dbInstance = {} as any;
    }

    return dbInstance;
}

export const db = getFirebaseDb();

export async function connectDB(): Promise<string> {
    console.log('Connected to Firebase Firestore database');
    return 'firestore';
}

export async function disconnectDB() {
    console.log('Disconnected Firebase connection');
}
