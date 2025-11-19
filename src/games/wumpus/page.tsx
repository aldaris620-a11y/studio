
'use client';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '../placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WumpusPage() {
  const router = useRouter();
  
  // TODO: Replace with actual game start logic
  const handleStartGame = () => {
    console.log("Iniciando el juego...");
    // router.push('/games/wumpus/play');
  };

  const coverImage = PlaceHolderImages.find(img => img.id === 'wumpus-1');

  return (
    <div className="flex h-full w-full items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg border border-primary/20 shadow-glow-primary">
        {coverImage && (
          <Image
            src={coverImage.imageUrl}
            alt={coverImage.description}
            fill
            className="object-cover opacity-20"
            data-ai-hint={coverImage.imageHint}
          />
        )}
        <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-12 text-center text-white bg-black/50">
           <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-widest uppercase text-primary animate-pulse">
            Ecos en la Oscuridad
          </h1>
          <p className="mt-4 max-w-xl text-lg text-foreground/80 font-body">
            En las profundidades de una caverna sin luz, algo antiguo y hambriento acecha. Solo tus sentidos pueden guiarte. Escucha el viento, huele el peligro, y caza a la bestia antes de que te encuentre a ti.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold"
              onClick={handleStartGame}
            >
              <Play className="mr-2 h-5 w-5" />
              Iniciar Caza
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 text-lg"
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
            <p className="animate-pulse">&gt; PRESIONA PARA INICIAR_</p>
          </div>
        </div>
      </div>
    </div>
  );
}
