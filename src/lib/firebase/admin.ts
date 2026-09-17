import { initializeApp, getApps, type App, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

if (getApps().length === 0) {
  if (!adminConfig.projectId || !adminConfig.clientEmail || !adminConfig.privateKey) {
    console.warn('Firebase Admin credentials not fully configured. Server-side Firestore operations will use client SDK.');
  } else {
    adminApp = initializeApp({
      credential: cert(adminConfig),
    });
    adminDb = getFirestore(adminApp);
  }
} else {
  adminApp = getApps()[0] as App;
  adminDb = getFirestore(adminApp);
}

export { adminApp, adminDb };
export const isAdminInitialized = !!adminDb;