import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth as fbGetAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage as fbGetStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Internal state
let _firebaseApp: FirebaseApp | null = null;
let _firebaseAuth: Auth | null = null;
let _firebaseDb: Firestore | null = null;
let _firebaseStorage: FirebaseStorage | null = null;

function initializeFirebase(): void {
  if (_firebaseApp) return;
  
  const hasValidConfig = firebaseConfig.apiKey && 
    firebaseConfig.projectId && 
    firebaseConfig.appId &&
    !firebaseConfig.apiKey?.includes('demo') &&
    !firebaseConfig.apiKey?.includes('your_');
  
  if (!hasValidConfig) {
    console.warn('Firebase config not fully configured or using demo credentials. Firebase services will be unavailable.');
    return;
  }

  try {
    if (getApps().length === 0) {
      _firebaseApp = initializeApp(firebaseConfig);
    } else {
      _firebaseApp = getApps()[0];
    }
    _firebaseAuth = fbGetAuth(_firebaseApp);
    _firebaseDb = getFirestore(_firebaseApp);
    _firebaseStorage = fbGetStorage(_firebaseApp);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

// Initialize synchronously on server-side
if (typeof window === 'undefined') {
  initializeFirebase();
}

// Synchronous getters
export function getFirebaseAppSync(): FirebaseApp | null {
  if (!_firebaseApp) initializeFirebase();
  return _firebaseApp;
}

export function getFirebaseAuthSync(): Auth | null {
  if (!_firebaseAuth) initializeFirebase();
  return _firebaseAuth;
}

export function getFirebaseDbSync(): Firestore | null {
  if (!_firebaseDb) initializeFirebase();
  return _firebaseDb;
}

export function getFirebaseStorageSync(): FirebaseStorage | null {
  if (!_firebaseStorage) initializeFirebase();
  return _firebaseStorage;
}

// Export the actual Firebase instances directly
export const app = getFirebaseAppSync()!;
export const auth = getFirebaseAuthSync()!;
export const db = getFirebaseDbSync()!;
export const storage = getFirebaseStorageSync()!;

export default app;