
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gamepad2, Trophy, Crosshair, Sparkles } from 'lucide-react';
import { GAMES } from '@/games';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="relative w-full">
        {/* Full-width background image */}
        <Image
          src={GAMES[0].imageUrl}
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-20"
          data-ai-hint={GAMES[0].imageHint}
        />
        <div className="relative z-10">
          <header className="px-4 lg:px-6 h-14 flex items-center bg-transparent">
            <Link href="#" className="flex items-center justify-center" prefetch={false}>
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="sr-only">Centro de Sincronización de Juegos</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
              <Link
                href="/login"
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:underline underline-offset-4"
                prefetch={false}
              >
                Iniciar Sesión
              </Link>
              <Button asChild size="sm" variant="secondary">
                <Link href="/signup" prefetch={false}>
                    Regístrate
                </Link>
              </Button>
            </nav>
          </header>

          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-4">
                      <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary-foreground">
                        Tu Universo de Juegos, Sincronizado.
                      </h1>
                      <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
                        El Centro de Sincronización de Juegos es la plataforma definitiva para unificar tu progreso, logros y recompensas en todos tus juegos.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" variant="default" onClick={handleGetStarted}>
                        ¡Comienza Ahora!
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <div className="bg-background">
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
            <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              {GAMES.map((game) => (
                <Card key={game.id} className="transform transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-2xl overflow-hidden group">
                   <CardHeader className="p-0">
                     <Image
                        src={game.imageUrl}
                        alt={`Cover art for ${game.name}`}
                        width={600}
                        height={400}
                        className="object-cover aspect-video group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        data-ai-hint={game.imageHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4 bg-card">
                    <CardTitle className="text-xl font-bold">{game.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm text-muted-foreground">{game.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
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
                <div className="bg-primary/10 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
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
      </div>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Centro de Sincronización de Juegos. Todos los derechos reservados.</p>
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
