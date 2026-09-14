import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
  type UserCredential,
  onAuthStateChanged,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config';
import type { User, UserRole } from '@/types';

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const createUserDocument = async (firebaseUser: FirebaseUser, name: string, role: UserRole = 'user'): Promise<User> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userData: User = {
    uid: firebaseUser.uid,
    name,
    email: firebaseUser.email!,
    role,
    photoURL: firebaseUser.photoURL || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: firebaseUser.emailVerified,
  };

  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userData;
};

export const register = async (data: RegisterData): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(userCredential.user, { displayName: data.name });
    const user = await createUserDocument(userCredential.user, data.name, 'user');
    return { user, error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    let errorMessage = 'Terjadi kesalahan saat mendaftar';

    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email sudah terdaftar';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email tidak valid';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password minimal 6 karakter';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Pendaftaran tidak diizinkan';
        break;
      default:
        errorMessage = firebaseError.message;
    }

    return { user: null, error: errorMessage };
  }
};

export const login = async (data: LoginData): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      return { user: userData, error: null };
    }

    const user = await createUserDocument(userCredential.user, userCredential.user.displayName || 'User', 'user');
    return { user, error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    let errorMessage = 'Terjadi kesalahan saat masuk';

    switch (firebaseError.code) {
      case 'auth/user-not-found':
        errorMessage = 'Akun tidak ditemukan';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Password salah';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email tidak valid';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Akun dinonaktifkan';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Terlalu banyak percobaan, coba lagi nanti';
        break;
      default:
        errorMessage = firebaseError.message;
    }

    return { user: null, error: errorMessage };
  }
};

export const logout = async (): Promise<{ error: string | null }> => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    return { error: firebaseError.message };
  }
};

export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    let errorMessage = 'Gagal mengirim email reset password';

    switch (firebaseError.code) {
      case 'auth/user-not-found':
        errorMessage = 'Email tidak terdaftar';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email tidak valid';
        break;
      default:
        errorMessage = firebaseError.message;
    }

    return { error: errorMessage };
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          resolve(userDoc.data() as User);
        } else {
          const user = await createUserDocument(firebaseUser, firebaseUser.displayName || 'User');
          resolve(user);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<{ error: string | null }> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    return { error: firebaseError.message };
  }
};

export const updateUserRole = async (uid: string, role: UserRole): Promise<{ error: string | null }> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    return { error: firebaseError.message };
  }
};

export const setUserActiveStatus = async (uid: string, isActive: boolean): Promise<{ error: string | null }> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      isActive,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    const firebaseError = error as { code: string; message: string };
    return { error: firebaseError.message };
  }
};

export { auth };