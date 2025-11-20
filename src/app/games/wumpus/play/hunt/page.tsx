
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';

const huntLevels = Array.from({ length: 10 }, (_, i) => ({
  id: `sector-${String(i + 1).padStart(2, '0')}`,
  level: i + 1,
  title: `Sector de Caza ${String(i + 1).padStart(2, '0')}`,
  description: i < 3 ? 'Baja actividad anómala detectada.' : i < 7 ? 'Múltiples peligros estructurales.' : 'Alerta: Entorno altamente hostil.',
  difficulty: i + 1,
  enabled: true, // For now, all levels are enabled
}));

export default function HuntSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLevelSelect = (levelId: string) => {
    setIsLoading(levelId);
    // TODO: Navigate to the actual game level. For now, it will just show a loading screen.
    console.log(`Cargando Nivel: ${levelId}`);
    // Example: router.push(`/games/wumpus/play/hunt/${levelId}`);
    setTimeout(() => setIsLoading(null), 2000); // Simulate loading
  };

  if (isLoading) {
    return <AnimatedLoading text={`Accediendo al Sector de Caza ${isLoading.split('-')[1]}...`} />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-wumpus-primary uppercase animate-pulse mb-2">
          CONTRATOS DE CACERÍA
        </h1>
        <p className="text-wumpus-foreground/70 mb-8 text-md">
          Selecciona un sector para iniciar la neutralización del Activo 734.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {huntLevels.map((level, index) => (
            <div
              key={level.id}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-wumpus-accent/20 bg-wumpus-card/80 p-4 text-left transition-all duration-300 ease-in-out fade-in",
                level.enabled ? "cursor-pointer hover:border-wumpus-primary hover:shadow-glow-wumpus-primary hover:-translate-y-1" : "opacity-50 cursor-not-allowed",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => level.enabled && handleLevelSelect(level.id)}
            >
              <h2 className="text-lg font-bold text-wumpus-primary">{level.title}</h2>
              <p className="text-xs text-wumpus-foreground/60 mt-1 h-10">{level.description}</p>
              <div className="flex items-center mt-3">
                <span className="text-xs font-semibold mr-2 text-wumpus-accent">Dificultad:</span>
                <div className="flex gap-1">
                  {[...Array(level.difficulty)].map((_, i) => (
                    <Skull key={i} className="h-3 w-3 text-wumpus-danger" />
                  ))}
                   {[...Array(10 - level.difficulty)].map((_, i) => (
                    <Skull key={i} className="h-3 w-3 text-wumpus-danger/20" />
                  ))}
                </div>
              </div>
               {!level.enabled && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="font-bold text-wumpus-danger">BLOQUEADO</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="ghost" onClick={() => router.back()} className="mt-12 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Tablero de Misiones
      </Button>
    </main>
  );
}
