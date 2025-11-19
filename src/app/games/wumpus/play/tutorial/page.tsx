
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, MoveRight, User, Mountain, Wind, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Definición de la estructura de una habitación
type Room = {
  id: number;
  name: string;
  connections: number[];
  hasWumpus: boolean;
  hasPit: boolean;
  hasBat: boolean;
};

// Mapa estático para el tutorial
const tutorialMap: Room[] = [
  { id: 1, name: 'Entrada de la Caverna', connections: [2, 5, 8], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 2, name: 'Encrucijada Húmeda', connections: [1, 3, 10], hasWumpus: false, hasPit: false, hasBat: true },
  { id: 3, name: 'Cámara del Eco', connections: [2, 4, 12], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 4, name: 'Galería Estrecha', connections: [3, 5, 14], hasWumpus: true, hasPit: false, hasBat: false },
  { id: 5, name: 'Caverna de Cristales', connections: [1, 4, 6], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 6, name: 'Pozo de Huesos', connections: [5, 7, 15], hasWumpus: false, hasPit: true, hasBat: false },
  { id: 7, name: 'Sima Ventosa', connections: [6, 8, 17], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 8, name: 'Túnel Desmoronado', connections: [1, 7, 9], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 9, name: 'Guarida Silenciosa', connections: [8, 10, 18], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 10, name: 'Mirador Oscuro', connections: [2, 9, 11], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 11, name: 'Nido de Murciélagos', connections: [10, 12, 19], hasWumpus: false, hasPit: false, hasBat: true },
  { id: 12, name: 'Cámara Olvidada', connections: [3, 11, 13], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 13, name: 'Fisura Profunda', connections: [12, 14, 20], hasWumpus: false, hasPit: true, hasBat: false },
  { id: 14, name: 'Guarida del Wumpus', connections: [4, 13, 15], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 15, name: 'Sala del Sacrificio', connections: [6, 14, 16], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 16, name: 'Río Subterráneo', connections: [15, 17, 20], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 17, name: 'Vientos Aulladores', connections: [7, 16, 18], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 18, name: 'Cruce Inestable', connections: [9, 17, 19], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 19, name: 'La Gran Bóveda', connections: [11, 18, 20], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 20, name: 'Abismo Sin Fondo', connections: [13, 16, 19], hasWumpus: false, hasPit: true, hasBat: false },
];


export default function TutorialPage() {
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const router = useRouter();

  const currentRoom = tutorialMap.find(room => room.id === playerRoomId);
  const connectedRooms = currentRoom?.connections.map(id => tutorialMap.find(room => room.id === id)).filter(Boolean) as Room[] || [];

  return (
    <div className="h-full w-full bg-background text-foreground p-4 flex flex-col md:flex-row gap-4">
      
      {/* Columna de Información y Acciones */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="text-primary"/>Estado del Cazador</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Te encuentras en: <span className="font-bold text-primary">{currentRoom?.name}</span> (Habitación {currentRoom?.id})</p>
            <p className="mt-4 text-sm text-muted-foreground">Analizando el entorno...</p>
             <div className="mt-2 space-y-1 text-sm">
                {/* Lógica de pistas irá aquí */}
                <div className="flex items-center gap-2"><Wind /> Sientes una ligera brisa.</div>
                <div className="flex items-center gap-2"><Skull /> Huele a algo terrible cerca.</div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 flex-grow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MoveRight className="text-primary"/>Moverse</CardTitle>
            <CardDescription>Selecciona una cueva adyacente para moverte.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {connectedRooms.map(room => (
              <Button key={room.id} variant="outline">
                Ir a la Habitación {room.id}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Columna del Mapa */}
      <div className="w-full md:w-2/3">
        <Card className="bg-card/50 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Network className="text-primary"/>Mapa de la Caverna (Nivel de Entrenamiento)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 text-center">
                {tutorialMap.map(room => (
                    <div
                        key={room.id}
                        className={cn(
                            "aspect-square rounded-md flex items-center justify-center p-1 border-2",
                            playerRoomId === room.id ? "bg-primary/20 border-primary shadow-glow-primary" : "bg-muted/30 border-muted",
                        )}
                    >
                        <div className="flex flex-col items-center">
                             <span className="font-bold text-sm md:text-base">{room.id}</span>
                             {playerRoomId === room.id && <User className="h-4 w-4 text-primary" />}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
