import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, setPersistence, browserLocalPersistence } from "firebase/auth";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const requiredEnvVars: Record<keyof FirebaseConfig, string | undefined> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const assertConfig = (): FirebaseConfig => {
  const missing = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing Firebase environment variables: ${missing.join(", ")}`);
  }

  return requiredEnvVars as FirebaseConfig;
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = assertConfig();
  firebaseApp = getApps().length ? getApps()[0] : initializeApp(config);
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (firebaseAuth) {
    return firebaseAuth;
  }
  const authInstance = getAuth(getFirebaseApp());
  void setPersistence(authInstance, browserLocalPersistence).catch(() => undefined);
  firebaseAuth = authInstance;
  return firebaseAuth;
};

export type OAuthProvider = "google" | "github";

