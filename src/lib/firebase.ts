import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'winter-kayak-ksjh2';
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '1:109017269012:web:d087e2ee94e439fb183801';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`;
const storageBucket = `${projectId}.firebasestorage.app`;

const clientConfig = {
  apiKey,
  projectId,
  appId,
  authDomain,
  storageBucket,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleAuthProvider: GoogleAuthProvider | null = null;

try {
  if (apiKey) {
    app = getApps().length ? getApps()[0] : initializeApp(clientConfig);
    auth = getAuth(app);
    googleAuthProvider = new GoogleAuthProvider();
  }
} catch (error) {
  console.warn('Firebase client initialization deferred or unavailable:', error);
}

export { app, auth, googleAuthProvider };
