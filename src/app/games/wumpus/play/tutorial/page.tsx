
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, User, Wind, Skull, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Definición de la estructura de una habitación
type Room = {
  id: number;
  name: string;
  connections: number[];
  hasWumpus: boolean;
  hasPit: boolean;
  hasBat: boolean;
};

// Coordenadas para el mapa holográfico (distribución circular)
const roomCoordinates = [
  { id: 1, x: 50, y: 10 }, { id: 2, x: 75, y: 15 }, { id: 3, x: 90, y: 30 },
  { id: 4, x: 90, y: 50 }, { id: 5, x: 75, y: 65 }, { id: 6, x: 50, y: 70 },
  { id: 7, x: 25, y: 65 }, { id: 8, x: 10, y: 50 }, { id: 9, x: 10, y: 30 },
  { id: 10, x: 25, y: 15 }, { id: 11, x: 40, y: 25 }, { id: 12, x: 60, y: 25 },
  { id: 13, x: 70, y: 40 }, { id: 14, x: 60, y: 55 }, { id: 15, x: 40, y: 55 },
  { id: 16, x: 30, y: 40 }, { id: 17, x: 20, y: 50 }, { id: 18, x: 20, y: 30 },
  { id: 19, x: 35, y: 20 }, { id: 20, x: 65, y: 20 },
];

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

  const handleMove = (roomId: number) => {
    setPlayerRoomId(roomId);
  };

  const { currentRoom, connectedRooms } = useMemo(() => {
    const room = tutorialMap.find(r => r.id === playerRoomId);
    if (!room) {
      setPlayerRoomId(1); // Reset to start on error
      return { currentRoom: tutorialMap[0], connectedRooms: tutorialMap[0].connections };
    }
    return { currentRoom: room, connectedRooms: room.connections };
  }, [playerRoomId]);

  return (
    <div className="h-full w-full bg-background text-foreground relative overflow-hidden">
      {/* HUD de Información */}
      <div className="absolute top-4 left-4 z-10 w-full max-w-xs">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-primary"><User />Estado del Cazador</CardTitle>
            <CardDescription>Protocolo de Entrenamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Posición: <span className="font-bold text-primary">{currentRoom?.name}</span> (Nodo {currentRoom?.id})</p>
            <p className="mt-2 text-xs text-muted-foreground">Analizando el entorno...</p>
             <div className="mt-1 space-y-1 text-xs">
                {/* Lógica de pistas irá aquí */}
                <div className="flex items-center gap-2"><Wind className="h-3 w-3"/> Sientes una ligera brisa.</div>
                <div className="flex items-center gap-2"><Skull className="h-3 w-3" /> Huele a algo terrible cerca.</div>
             </div>
          </CardContent>
        </Card>
        <Button variant="ghost" onClick={() => router.back()} className="mt-2 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Salir de la Simulación
        </Button>
      </div>

      {/* Mapa Holográfico SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {/* Renderizar todas las conexiones en gris */}
            {tutorialMap.map(room => {
                const startPos = roomCoordinates.find(c => c.id === room.id);
                return room.connections.map(connId => {
                    const endPos = roomCoordinates.find(c => c.id === connId);
                    if (!startPos || !endPos || startPos.id > endPos.id) return null; // Evita duplicar líneas

                     const isPathActive = (playerRoomId === startPos.id && connectedRooms.includes(endPos.id)) ||
                                       (playerRoomId === endPos.id && connectedRooms.includes(startPos.id));
                    
                    return (
                       <line 
                          key={`${room.id}-${connId}`}
                          x1={startPos.x} y1={startPos.y}
                          x2={endPos.x} y2={endPos.y}
                          className={cn(
                            "stroke-muted/30 transition-all duration-300",
                            isPathActive && "stroke-primary/80"
                          )}
                          strokeWidth="0.2"
                        />
                    )
                })
            })}

            {/* Renderizar Nodos (Habitaciones) */}
            {roomCoordinates.map(coord => {
              const isPlayerInRoom = playerRoomId === coord.id;
              const isConnected = connectedRooms.includes(coord.id);
              const isClickable = isConnected && !isPlayerInRoom;

              return (
                <g key={coord.id}>
                    {/* Anillo exterior para la habitación actual */}
                    {isPlayerInRoom && (
                         <circle
                            cx={coord.x}
                            cy={coord.y}
                            r="3"
                            className="fill-none stroke-primary/80"
                            strokeWidth="0.3"
                          >
                            <animate
                                attributeName="stroke-width"
                                values="0.3;0.6;0.3"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                         </circle>
                    )}
                    <circle
                      onClick={() => isClickable && handleMove(coord.id)}
                      cx={coord.x}
                      cy={coord.y}
                      r={isPlayerInRoom ? "2" : "1.5"}
                      className={cn(
                        "fill-muted/50 stroke-primary/50 transition-all duration-300",
                        isPlayerInRoom ? "fill-primary/70 stroke-primary" : "stroke-muted",
                        isClickable ? "cursor-pointer pointer-events-auto fill-primary/30 hover:fill-primary" : "",
                      )}
                      strokeWidth="0.2"
                    >
                     {isClickable && (
                        <animate
                            attributeName="r"
                            values="1.5;2;1.5"
                            dur="1.5s"
                            repeatCount="indefinite"
                         />
                     )}
                    </circle>
                     <text x={coord.x} y={coord.y + 0.5} textAnchor="middle" dy="0.1em" className="fill-foreground text-[1px] font-sans pointer-events-none">
                        {coord.id}
                    </text>
                </g>
              );
            })}
          </svg>
      </div>
    </div>
  );
}

    