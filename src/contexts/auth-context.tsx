'use client';

import { type ReactNode, createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Gamepad2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
          <Gamepad2 className="h-12 w-12 animate-pulse text-primary" />
           <p className="mt-4 text-lg font-semibold text-foreground">
            Loading GameSync Hub...
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
