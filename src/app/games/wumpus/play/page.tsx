
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Crosshair, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  const handleModeSelect = (modeId: GameModeId) => {
    // TODO: Navigate to the actual game screen for the selected mode
    console.log(`Modo seleccionado: ${modeId}`);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center my-2 md:my-4">
        <h1 className="text-2xl md:text-4xl font-bold md:tracking-widest text-primary uppercase">Tablero de Misiones</h1>
        <p className="text-muted-foreground mt-2 text-xs md:text-base">Selecciona tu próximo contrato, cazador.</p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-2">
        {gameModes.map((mode) => (
          <Card 
            key={mode.id}
            className={cn(
                "bg-card/50 border-primary/20 flex flex-col cursor-pointer",
                "transition-all duration-300 ease-in-out",
                "hover:scale-105 hover:shadow-glow-primary hover:border-primary"
            )}
            onClick={() => handleModeSelect(mode.id as GameModeId)}
          >
            <CardHeader className="items-center text-center p-2">
              <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                <mode.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <CardTitle className="text-base md:text-lg font-headline">{mode.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex-grow p-4 pt-0">
              <p className="text-muted-foreground text-xs md:text-sm">
                {mode.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="ghost" onClick={() => router.back()} className="mt-4 md:mt-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Menú Principal
      </Button>
    </div>
  );
}
