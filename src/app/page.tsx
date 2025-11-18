
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Save, Trophy, Crosshair, Sparkles } from 'lucide-react';
import { GAMES } from '@/games';
import { useUser } from '@/firebase';
import { AnimatedLoading } from '@/components/animated-loading';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };
  
  const handleGetStarted = () => {
    if (user) {
      handleNavigation('/dashboard');
    } else {
      handleNavigation('/signup');
    }
  };

  if (isNavigating) {
    return <AnimatedLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center z-10">
        <button onClick={() => handleNavigation('/')} className="flex items-center justify-center">
          <Save className="h-6 w-6 text-primary" />
          <span className="sr-only">Save Point</span>
        </button>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => handleNavigation('/login')}
            className="text-sm font-medium text-foreground/80 hover:text-foreground hover:underline underline-offset-4"
          >
            Iniciar Sesión
          </button>
          <Button asChild size="sm" variant="secondary">
            <button onClick={() => handleNavigation('/signup')}>
                Regístrate
            </button>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 text-center">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Save Point
                    </h1>
                    <p className="max-w-[700px] text-foreground/80 md:text-xl">
                        La plataforma definitiva para unificar tu progreso, logros y recompensas en todos tus juegos.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleGetStarted}>
                        ¡Comienza Ahora!
                      </Button>
                    </div>
                </div>
            </div>
        </section>

        <section id="games" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Juegos Destacados</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explora nuestra creciente biblioteca de juegos compatibles. Tu progreso te sigue a donde vayas.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
              {GAMES.map((game) => {
                const Icon = game.icon;
                return (
                    <div key={game.id} className="group relative flex flex-col items-center justify-center space-y-4 rounded-lg border border-primary/20 bg-gradient-to-br from-card/80 to-card/40 p-8 text-center shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-glow-primary">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{game.name}</h3>
                      <p className="text-muted-foreground">{game.description}</p>
                    </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card/80">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Eleva tu Experiencia de Juego.
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nunca pierdas tu progreso. Gana recompensas que trascienden los juegos individuales. Demuestra tu maestría.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Crosshair className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sincronización de Progreso</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu nivel, puntuación y avances se guardan en la nube y están siempre disponibles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Logros Unificados</h3>
                  <p className="text-sm text-muted-foreground">
                    Consigue logros y presume de tus hazañas en tu perfil de jugador global.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Recompensas Entre Juegos</h3>
                  <p className="text-sm text-muted-foreground">
                    Desbloquea contenido en un juego al alcanzar hitos en otro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card/80">
        <p className="text-xs text-muted-foreground">Creado por rasec inc todos los derechos reservados</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Política de Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}

    