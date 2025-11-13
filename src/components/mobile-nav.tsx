'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Menu, Settings, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', label: 'Panel', icon: Gamepad2 },
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
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold text-primary"
                  >
                    <Gamepad2 className="h-6 w-6" />
                    <span>Centro de Sincronización</span>
                  </Link>
                   {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                                { 'bg-muted text-foreground': pathname.startsWith(item.href) }
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
