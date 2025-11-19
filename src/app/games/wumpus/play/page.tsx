
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GraduationCap, Crosshair, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const gameModes = [
  {
    id: 'tutorial',
    title: 'Protocolo de Entrenamiento',
    icon: GraduationCap,
    description: 'Una simulación segura para nuevos cazadores. Aprende las mecánicas básicas, cómo interpretar las señales de la cueva y a utilizar tu equipo sin el riesgo de convertirte en la cena del Wumpus.',
  },
  {
    id: 'caceria',
    title: 'Protocolo de Cacería Estándar',
    icon: Crosshair,
    description: 'La caza en su forma más pura. Entra en una caverna generada proceduralmente y da caza a la bestia. Cada partida es un nuevo desafío. Rápido, directo y altamente rejugable.',
  },
  {
    id: 'historia',
    title: 'Protocolo de Investigación Narrativa',
    icon: FileText,
    description: 'Descubre la verdad tras el Proyecto Wumpus. ¿Qué es esta criatura? ¿Por qué estás aquí? Sigue una historia a través de una serie de cavernas prediseñadas y desvela los secretos que se ocultan en la oscuridad.',
  },
];

type GameModeId = 'tutorial' | 'caceria' | 'historia';

export default function GameModeSelectionPage() {
  const router = useRouter();
  const [hoveredMode, setHoveredMode] = useState<GameModeId>('caceria');

  const selectedMode = gameModes.find((mode) => mode.id === hoveredMode);
  
  const handleModeSelect = (modeId: GameModeId) => {
    // TODO: Navigate to the actual game screen for the selected mode
    console.log(`Modo seleccionado: ${modeId}`);
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Columna Izquierda: Modos de Juego */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-widest text-primary uppercase mb-4">Seleccionar Protocolo</h1>
          {gameModes.map((mode) => (
            <Button
              key={mode.id}
              variant="outline"
              className={cn(
                "h-auto justify-start p-4 text-left border-2 transition-all duration-200 ease-in-out",
                hoveredMode === mode.id 
                  ? 'border-primary/80 bg-primary/10 shadow-glow-primary scale-105' 
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
              )}
              onMouseEnter={() => setHoveredMode(mode.id as GameModeId)}
              onClick={() => handleModeSelect(mode.id as GameModeId)}
            >
              <mode.icon className="h-6 w-6 mr-4 flex-shrink-0 text-primary" />
              <span className="text-lg font-semibold flex-shrink">{mode.title}</span>
            </Button>
          ))}
            <Button variant="ghost" onClick={() => router.back()} className="mt-6 self-start">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancelar Misión
            </Button>
        </div>
        
        {/* Columna Derecha: Descripción */}
        <Card className="bg-card/50 border-primary/20 h-full hidden md:flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                    {selectedMode?.icon && <selectedMode.icon className="h-8 w-8 text-primary" />}
                    <h2 className="text-2xl font-bold">{selectedMode?.title}</h2>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground text-base">
                    {selectedMode?.description}
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
