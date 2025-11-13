
'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// Initialize Firebase immediately at the module level.
// This ensures it's done only once, outside of the React render cycle.
const { firebaseApp, auth, firestore } = initializeFirebase();

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // The services are now guaranteed to be initialized.
  if (!firebaseApp || !auth || !firestore) {
    // This should theoretically never happen.
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
