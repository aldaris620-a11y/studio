
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Brain, Dices, Skull, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    enabled: false,
  },
  {
    id: 'intermedia',
    title: 'Práctica Intermedia',
    icon: Dices,
    description: 'Un mapa aleatorio con una configuración de peligro estándar.',
    enabled: false,
  },
    {
    id: 'avanzada',
    title: 'Práctica Avanzada',
    icon: Skull,
    description: 'Un desafío difícil con más peligros y un Wumpus más astuto.',
    enabled: false,
  },
];

export default function TrainingSelectionPage() {
  const router = useRouter();
  
  const handleLevelSelect = (levelId: string) => {
    if (levelId === 'tutorial') {
      router.push('/games/wumpus/play/tutorial');
    } else {
      // Placeholder for other levels
      console.log(`Nivel seleccionado: ${levelId}`);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Protocolo de Entrenamiento</h1>
        <p className="text-muted-foreground mt-2">Selecciona la simulación para afinar tus habilidades de caza.</p>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainingLevels.map((level) => (
          <Card 
            key={level.id}
            className={cn(
                "bg-card/50 border-primary/20 flex flex-col text-left",
                level.enabled ? "cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-glow-primary hover:border-primary" : "opacity-50 cursor-not-allowed"
            )}
            onClick={() => level.enabled && handleLevelSelect(level.id)}
          >
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <level.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-headline">{level.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">
                {level.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="ghost" onClick={() => router.back()} className="mt-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Selección de Modo
      </Button>
    </div>
  );
}
