"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { AnimatedLoading } from '@/components/animated-loading';
import { GAMES } from '@/games';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // Redirect to the first game in the registry
        router.replace(`/games/${GAMES[0].id}`);
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return <AnimatedLoading />;
}
