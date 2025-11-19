
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Crosshair, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';

const gameModes = [
  {
    id: 'tutorial',
    title: 'Protocolo de Entrenamiento',
    icon: GraduationCap,
    description: 'Una simulación segura para nuevos cazadores. Aprende las mecánicas básicas y a interpretar las señales.',
  },
  {
    id: 'caceria',
    title: 'Protocolo de Cacería',
    icon: Crosshair,
    description: 'La caza en su forma más pura. Entra en una caverna generada proceduralmente y da caza a la bestia.',
  },
  {
    id: 'historia',
    title: 'Investigación Narrativa',
    icon: FileText,
    description: 'Descubre la verdad tras el Proyecto Wumpus. Sigue una historia a través de una serie de cavernas.',
  },
];

type GameModeId = 'tutorial' | 'caceria' | 'historia';

export default function GameModeSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<GameModeId | null>(null);
  
  const handleModeSelect = (modeId: GameModeId) => {
    setIsLoading(modeId);
    if (modeId === 'tutorial') {
      router.push('/games/wumpus/play/training');
    } else {
      // TODO: Navigate to the actual game screen for the selected mode
      console.log(`Modo seleccionado: ${modeId}`);
      setTimeout(() => setIsLoading(null), 1000); // For now, just reset loading state
    }
  }

  if (isLoading) {
    return <AnimatedLoading text={`Cargando ${isLoading}...`} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold md:tracking-widest text-wumpus-primary uppercase">Tablero de Misiones</h1>
          <p className="text-wumpus-foreground/70 mt-2 text-md">Selecciona tu próximo contrato, cazador.</p>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameModes.map((mode) => (
            <Card 
              key={mode.id}
              className={cn(
                  "bg-wumpus-card/80 border-wumpus-primary/20 flex flex-col cursor-pointer text-wumpus-foreground",
                  "transition-all duration-300 ease-in-out",
                  "hover:scale-105 hover:shadow-glow-wumpus-primary hover:border-wumpus-primary"
              )}
              onClick={() => handleModeSelect(mode.id as GameModeId)}
            >
              <CardHeader className="items-center text-center p-4">
                <div className="p-3 bg-wumpus-primary/10 rounded-full border border-wumpus-primary/20">
                  <mode.icon className="h-10 w-10 text-wumpus-primary" />
                </div>
                <CardTitle className="text-xl font-headline mt-2">{mode.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow p-4 pt-0">
                <p className="text-wumpus-foreground/70 text-sm">
                  {mode.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button variant="ghost" onClick={() => router.back()} className="mt-8 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Menú Principal
        </Button>
      </div>
    </div>
  );
}
