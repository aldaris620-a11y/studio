'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Save, Settings, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GAMES } from '@/games';

const topNavItems = [
    { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
];

const bottomNavItems = [
    { href: '/profile', label: 'Perfil', icon: User },
    { href: '/settings', label: 'Ajustes', icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <Save className="h-6 w-6" />
            <span className="">Save Point</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {topNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  { 'bg-muted text-primary': pathname === item.href }
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
             <hr className="my-2" />
             {GAMES.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  { 'bg-muted text-primary': pathname === `/games/${game.id}` }
                )}
              >
                <game.icon className="h-4 w-4" />
                {game.name}
              </Link>
            ))}
             <hr className="my-2" />
             {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  { 'bg-muted text-primary': pathname === item.href }
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
