"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Gamepad2 } from 'lucide-react';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <Gamepad2 className="h-12 w-12 animate-pulse text-primary" />
      <p className="mt-4 text-lg font-semibold text-foreground">
        Cargando Centro de Sincronización de Juegos...
      </p>
    </div>
  );
}
