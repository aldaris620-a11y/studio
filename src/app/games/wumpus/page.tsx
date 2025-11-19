
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WumpusPage() {
  const router = useRouter();
  
  const handleStartGame = () => {
    router.push('/games/wumpus/play');
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-wumpus-background p-4">
      <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary">
        <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-12 text-center text-white bg-black/50">
           <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-widest uppercase text-wumpus-primary animate-pulse">
            Ecos en la Oscuridad
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg text-wumpus-foreground/80 font-body">
            En las profundidades de una caverna sin luz, algo antiguo y hambriento acecha. Solo tus sentidos pueden guiarte. Escucha el viento, huele el peligro, y caza a la bestia antes de que te encuentre a ti.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-wumpus-primary text-wumpus-primary-foreground hover:bg-wumpus-primary/90 text-lg font-bold shadow-glow-wumpus-primary"
              onClick={handleStartGame}
            >
              <Play className="mr-2 h-5 w-5" />
              Iniciar Caza
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent text-lg"
              asChild
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver al Centro de Mando
              </Link>
            </Button>
          </div>
           <div className="mt-12 text-sm text-muted-foreground font-code">
            <p>&gt; Sistema: Listo para la misión.</p>
            <p className="animate-pulse text-wumpus-accent">&gt; PRESIONA PARA INICIAR_</p>
          </div>
        </div>
      </div>
    </div>
  );
}
