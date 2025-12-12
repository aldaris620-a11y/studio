"use client";

import { FirebaseProvider, FirebaseProviderProps } from "./provider";
import { useMemo } from "react";
import { initializeFirebase } from ".";

// This provider is responsible for initializing Firebase on the client side.
// It should be used as a wrapper around the main layout of the application.
//
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

    return (
        <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
            {children}
        </FirebaseProvider>
    );
}
