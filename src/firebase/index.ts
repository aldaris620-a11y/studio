
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
        console.log('Connecting to Firebase emulators...');
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
        console.log('Successfully connected to emulators.');
      } catch (e) {
        console.error('Error connecting to Firebase emulators:', e);
      }
  }

  return { firebaseApp: app, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
