
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Wind, Skull, ArrowLeft, VenetianMask, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Definición de la estructura de una habitación
type Room = {
  id: number;
  connections: number[];
  hasWumpus: boolean;
  hasPit: boolean;
  hasBat: boolean;
};

// Mapa estático para el tutorial con una disposición de 4x4 (16 habitaciones)
const tutorialMapLayout: Room[] = [
  // Row 1
  { id: 1, connections: [2, 5], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 2, connections: [1, 3, 6], hasWumpus: false, hasPit: false, hasBat: true },
  { id: 3, connections: [2, 4, 7], hasWumpus: false, hasPit: true, hasBat: false },
  { id: 4, connections: [3, 8], hasWumpus: false, hasPit: false, hasBat: false },
  // Row 2
  { id: 5, connections: [1, 6, 9], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 6, connections: [2, 5, 7, 10], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 7, connections: [3, 6, 8, 11], hasWumpus: true, hasPit: false, hasBat: false }, // Wumpus is here
  { id: 8, connections: [4, 7, 12], hasWumpus: false, hasPit: false, hasBat: false },
  // Row 3
  { id: 9, connections: [5, 10, 13], hasWumpus: false, hasPit: true, hasBat: false },
  { id: 10, connections: [6, 9, 11, 14], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 11, connections: [7, 10, 12, 15], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 12, connections: [8, 11, 16], hasWumpus: false, hasPit: false, hasBat: true },
  // Row 4
  { id: 13, connections: [9, 14], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 14, connections: [10, 13, 15], hasWumpus: false, hasPit: false, hasBat: false },
  { id: 15, connections: [11, 14, 16], hasWumpus: false, hasPit: true, hasBat: false },
  { id: 16, connections: [12, 15], hasWumpus: false, hasPit: false, hasBat: false },
];

// Helper para obtener una habitación por su ID
const getRoomById = (id: number) => tutorialMapLayout.find(r => r.id === id);


export default function TutorialPage() {
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const router = useRouter();

  const handleMove = (roomId: number) => {
    setPlayerRoomId(roomId);
  };

  const { currentRoom, connectedRooms, senses } = useMemo(() => {
    const room = getRoomById(playerRoomId);
    if (!room) {
      // Fallback en caso de error
      setPlayerRoomId(1);
      const firstRoom = getRoomById(1)!;
      return { currentRoom: firstRoom, connectedRooms: firstRoom.connections, senses: [] };
    }
    const connections = room.connections;
    
    let wumpusNearby = false;
    let pitNearby = false;
    let batNearby = false;

    for (const connectedId of connections) {
        const connectedRoom = getRoomById(connectedId);
        if (connectedRoom) {
            if (connectedRoom.hasWumpus) wumpusNearby = true;
            if (connectedRoom.hasPit) pitNearby = true;
            if (connectedRoom.hasBat) batNearby = true;
        }
    }

    const senses_warnings: { text: string; icon: React.ElementType; color: string }[] = [];
    if (wumpusNearby) senses_warnings.push({ text: 'Huele a algo terrible cerca.', icon: Skull, color: 'text-red-400' });
    if (pitNearby) senses_warnings.push({ text: 'Sientes una ligera brisa.', icon: Wind, color: 'text-blue-400' });
    if (batNearby) senses_warnings.push({ text: 'Oyes un aleteo cercano.', icon: VenetianMask, color: 'text-purple-400' });

    return { currentRoom: room, connectedRooms: connections, senses: senses_warnings };
  }, [playerRoomId]);

  return (
    <div className="h-full w-full bg-background text-foreground flex flex-col md:flex-row items-center justify-center gap-8 p-4">
      {/* Panel de Información */}
      <div className="w-full md:w-1/4 max-w-sm">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-primary"><User />Estado del Cazador</CardTitle>
            <CardDescription>Tutorial Guiado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Posición: <span className="font-bold text-primary">Habitación {currentRoom?.id}</span></p>
            <p className="mt-4 text-xs text-muted-foreground">Analizando el entorno...</p>
             <div className="mt-2 space-y-2 text-sm font-code">
                {senses.length > 0 ? senses.map((sense, index) => (
                    <div key={`${playerRoomId}-${index}`} className={cn("flex items-center gap-2", sense.color)}>
                        <sense.icon className="h-4 w-4 flex-shrink-0"/>
                        <p className="typing-effect">{sense.text}</p>
                    </div>
                )) : (
                  <p key={playerRoomId} className="typing-effect text-muted-foreground italic">
                    No hay peligros inmediatos.
                  </p>
                )}
             </div>
          </CardContent>
        </Card>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4 text-muted-foreground w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Salir del Tutorial
        </Button>
      </div>

      {/* Mapa de Cuadrícula */}
      <div className="grid grid-cols-4 gap-1 bg-black/20 p-2 rounded-lg border border-primary/20">
        {tutorialMapLayout.map(room => {
          const isPlayerInRoom = playerRoomId === room.id;
          const isConnected = connectedRooms.includes(room.id);
          const isClickable = isConnected && !isPlayerInRoom;

          return (
            <div
              key={room.id}
              onClick={() => isClickable && handleMove(room.id)}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              onKeyDown={(e) => isClickable && (e.key === 'Enter' || e.key === ' ') && handleMove(room.id)}
              className={cn(
                'relative flex items-center justify-center w-20 h-20 border border-primary/30 text-primary',
                'transition-all duration-200',
                isPlayerInRoom && 'bg-primary/30 ring-2 ring-primary',
                isClickable && 'bg-primary/10 hover:bg-primary/20 cursor-pointer',
                !isClickable && !isPlayerInRoom && 'bg-background/80'
              )}
            >
              <span className="absolute top-1 left-1 text-xs font-bold">{room.id}</span>
              <div className="flex flex-col items-center justify-center">
                 {isPlayerInRoom && <User className="h-8 w-8" />}
                 {room.hasWumpus && <Skull className="h-8 w-8 text-destructive" />}
                 {room.hasPit && <Circle className="h-8 w-8 text-blue-500 fill-current" />}
                 {room.hasBat && <VenetianMask className="h-8 w-8 text-purple-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
