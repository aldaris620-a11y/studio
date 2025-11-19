
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Wind, Skull, AlertTriangle, Shuffle, Circle, Crosshair, LogOut } from 'lucide-react';
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
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const router = useRouter();

  const handleMove = (roomId: number) => {
    setPlayerRoomId(roomId);
    setIsShooting(false); // Salir del modo de disparo al moverse
  };
  
  const handleShootClick = () => {
    setIsShooting(prev => !prev);
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
    
    const senseTypes = {
        wumpus: { text: 'Alerta: Interferencia biológica detectada.', icon: Skull, color: 'text-wumpus-danger', id: 'wumpus' },
        pit: { text: 'Peligro estructural: Pozo de mantenimiento abierto.', icon: AlertTriangle, color: 'text-wumpus-warning', id: 'pit' },
        bat: { text: 'Subsistema errático: Dron de transporte activado.', icon: Shuffle, color: 'text-wumpus-accent', id: 'bat' }
    };

    const senses_warnings: { text: string; icon: React.ElementType; color: string, id: string }[] = [];
    const detectedSenses = new Set();

    for (const connectedId of connections) {
        const connectedRoom = getRoomById(connectedId);
        if (connectedRoom) {
            if (connectedRoom.hasWumpus && !detectedSenses.has('wumpus')) {
                senses_warnings.push(senseTypes.wumpus);
                detectedSenses.add('wumpus');
            }
            if (connectedRoom.hasPit && !detectedSenses.has('pit')) {
                senses_warnings.push(senseTypes.pit);
                detectedSenses.add('pit');
            }
            if (connectedRoom.hasBat && !detectedSenses.has('bat')) {
                senses_warnings.push(senseTypes.bat);
                detectedSenses.add('bat');
            }
        }
    }

    return { currentRoom: room, connectedRooms: connections, senses: senses_warnings };
  }, [playerRoomId]);

  return (
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex flex-col md:flex-row items-center justify-center gap-8 p-4 relative">
       {/* Botón de Salir */}
      <Button variant="ghost" size="icon" onClick={() => router.back()} className="absolute top-4 right-4 text-wumpus-accent hover:text-wumpus-primary hover:bg-wumpus-primary/10">
          <LogOut className="h-6 w-6" />
      </Button>
      
      {/* Panel de Información */}
      <div className="w-full md:w-1/4 max-w-sm">
        <Card className="bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-wumpus-primary"><UserCog />Estado del Extractor</CardTitle>
            <CardDescription className="text-wumpus-foreground/60">Simulación de Entrenamiento</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-xs font-code min-h-[50px]">
                {senses.length > 0 ? senses.map((sense, index) => (
                    <div key={`${playerRoomId}-${index}`} className={cn("flex items-center gap-2", sense.color)}>
                        <sense.icon className="h-4 w-4 flex-shrink-0"/>
                        <p>{sense.text}</p>
                    </div>
                )) : (
                  <p key={`${playerRoomId}-no-senses`} className="text-wumpus-foreground/70 italic">
                    Sistemas estables. No hay peligros inmediatos.
                  </p>
                )}
             </div>
             <Button className="w-full mt-4 bg-wumpus-primary/20 border border-wumpus-primary text-wumpus-primary hover:bg-wumpus-primary/30 hover:text-wumpus-primary" variant={isShooting ? "destructive" : "outline"} onClick={handleShootClick} >
                <Crosshair className="mr-2 h-4 w-4" />
                {isShooting ? 'Apuntando...' : 'Armar Cañón de Pulso'}
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de Cuadrícula */}
      <div className="grid grid-cols-4 gap-1 bg-black/30 p-2 rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary">
        {tutorialMapLayout.map(room => {
          const isPlayerInRoom = playerRoomId === room.id;
          const isConnected = connectedRooms.includes(room.id);
          const isClickableForMove = isConnected && !isPlayerInRoom && !isShooting;
          const isClickableForShoot = isConnected && !isPlayerInRoom && isShooting;

          return (
            <div
              key={room.id}
              onClick={() => {
                if (isClickableForMove) handleMove(room.id);
                if (isClickableForShoot) {
                  // Lógica de disparo irá aquí
                  setIsShooting(false);
                }
              }}
              role="button"
              tabIndex={isClickableForMove || isClickableForShoot ? 0 : -1}
              className={cn(
                'relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 border border-wumpus-accent/20 text-wumpus-accent',
                'transition-all duration-200',
                isPlayerInRoom && 'bg-wumpus-primary/20 ring-2 ring-wumpus-primary text-wumpus-primary',
                isClickableForMove && 'bg-wumpus-accent/10 hover:bg-wumpus-accent/20 hover:border-wumpus-accent cursor-pointer',
                isClickableForShoot && 'bg-wumpus-danger/20 hover:bg-wumpus-danger/30 hover:border-wumpus-danger cursor-crosshair ring-1 ring-wumpus-danger',
                !isClickableForMove && !isClickableForShoot && !isPlayerInRoom && 'bg-wumpus-background/50'
              )}
            >
              <div className="flex flex-col items-center justify-center">
                 {isPlayerInRoom && (
                    <>
                        <UserCog className="h-8 w-8" />
                        <div className="absolute top-1 left-1 flex gap-1">
                            {senses.find(s => s.id === 'wumpus') && <Skull className="h-3 w-3 text-wumpus-danger" />}
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1">
                            {senses.find(s => s.id === 'pit') && <AlertTriangle className="h-3 w-3 text-wumpus-warning" />}
                        </div>
                        <div className="absolute bottom-1 left-1 flex gap-1">
                            {senses.find(s => s.id === 'bat') && <Shuffle className="h-3 w-3 text-wumpus-accent" />}
                        </div>
                    </>
                 )}
                 {room.hasWumpus && <Skull className="h-8 w-8 text-wumpus-danger" />}
                 {room.hasPit && <Circle className="h-8 w-8 text-wumpus-warning fill-current" />}
                 {room.hasBat && <Shuffle className="h-8 w-8 text-wumpus-accent" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
