
import { AuthGuard } from '@/components/auth-guard';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { UserNav } from '@/components/user-nav';
import { Suspense } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <FirebaseErrorListener />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <MainNav />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card/40 px-4 lg:h-[60px] lg:px-6">
            <MobileNav />
            <div className="w-full flex-1" />
            <UserNav />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Suspense fallback={<AnimatedLoading />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
