'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isConfigured = getApps().length > 0;
  const app = !isConfigured ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (process.env.NODE_ENV === 'development' && !auth.emulatorConfig && !firestore.emulatorConfig) {
      // Connect to emulators if in development and not already connected
      // NOTE: process.env.NEXT_PUBLIC_... variables are not available in this file
      try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      } catch (e) {
        console.error('Error connecting to Firebase emulators. Make sure they are running.', e);
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