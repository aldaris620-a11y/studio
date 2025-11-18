
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Save, Menu, Settings, User, LayoutDashboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { GAMES } from '@/games';

const navItems = [
    { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
];

const bottomNavItems = [
    { href: '/profile', label: 'Perfil', icon: User },
    { href: '/settings', label: 'Ajustes', icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();
    return (
        <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Alternar menú de navegación</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold text-primary"
                  >
                    <Save className="h-6 w-6" />
                    <span>Save Point</span>
                  </Link>
                   {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                                { 'bg-muted text-foreground': pathname === item.href }
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                    <hr className="my-2" />
                    {GAMES.map((game) => (
                         <Link
                            key={game.id}
                            href={`/games/${game.id}`}
                            className={cn(
                                'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                                { 'bg-muted text-foreground': pathname === `/games/${game.id}` }
                            )}
                        >
                            <game.icon className="h-5 w-5" />
                            {game.name}
                        </Link>
                    ))}
                    <hr className="my-2" />
                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                                { 'bg-muted text-foreground': pathname === item.href }
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
              </SheetContent>
            </Sheet>
    )
}
