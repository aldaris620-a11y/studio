
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Brain, Dices, Skull, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';

const trainingLevels = [
  {
    id: 'tutorial',
    title: 'Tutorial Guiado',
    icon: GraduationCap,
    description: 'Aprende los conceptos básicos con todos los peligros visibles. Ideal para tu primera vez.',
    enabled: true,
  },
  {
    id: 'facil',
    title: 'Práctica Fácil',
    icon: Brain,
    description: 'Un mapa sencillo con menos peligros. Los peligros no son visibles.',
    enabled: true,
  },
  {
    id: 'intermedia',
    title: 'Práctica Intermedia',
    icon: Dices,
    description: 'Un mapa aleatorio con una configuración de peligro estándar.',
    enabled: true,
  },
    {
    id: 'avanzada',
    title: 'Práctica Avanzada',
    icon: Skull,
    description: 'Un desafío difícil con más peligros y un Wumpus más astuto.',
    enabled: true,
  },
];

export default function TrainingSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const handleLevelSelect = (levelId: string) => {
    setIsLoading(levelId);
    if (levelId === 'tutorial') {
      router.push('/games/wumpus/play/tutorial');
    } else if (levelId === 'facil') {
      router.push('/games/wumpus/play/easy');
    } else {
      // Placeholder for other levels
      console.log(`Nivel seleccionado: ${levelId}`);
       setTimeout(() => setIsLoading(null), 1000);
    }
  }

  if (isLoading) {
    return <AnimatedLoading text="Cargando simulación..." />;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-wumpus-primary">Protocolo de Entrenamiento</h1>
            <p className="text-wumpus-foreground/70 mt-1 text-sm">Selecciona la simulación para afinar tus habilidades de caza.</p>
          </div>

          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-2">
            {trainingLevels.map((level) => (
              <Card 
                key={level.id}
                className={cn(
                    "bg-wumpus-card/80 border-wumpus-primary/20 flex flex-col text-left text-wumpus-foreground",
                    level.enabled ? "cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-glow-wumpus-primary hover:border-wumpus-primary" : "opacity-50 cursor-not-allowed"
                )}
                onClick={() => level.enabled && handleLevelSelect(level.id)}
              >
                <CardHeader className="flex-row items-center gap-4 space-y-0 p-3 pb-2">
                  <div className="p-2 bg-wumpus-primary/10 rounded-lg border border-wumpus-primary/20">
                    <level.icon className="h-5 w-5 text-wumpus-primary" />
                  </div>
                  <CardTitle className="text-lg font-headline">{level.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-3 pt-0">
                  <p className="text-wumpus-foreground/70 text-sm">
                    {level.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button variant="ghost" onClick={() => router.back()} className="mt-6 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Selección de Modo
          </Button>
      </div>
    </main>
  );
}
