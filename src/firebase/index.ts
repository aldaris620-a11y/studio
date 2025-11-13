
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): { firebaseApp: FirebaseApp, auth: Auth, firestore: Firestore } {
  const isConfigured = getApps().length > 0;
  const app = !isConfigured ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Use NEXT_PUBLIC_ variable which is available on the client
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
      try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      } catch (e) {
        // Silently catch errors. If emulators are not running, it will connect to production.
        // This is a more robust approach in development environments.
      }
  }

  return { firebaseApp: app, auth, firestore };
}

export * from './provider';

export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
