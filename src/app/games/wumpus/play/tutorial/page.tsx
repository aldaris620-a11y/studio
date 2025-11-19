
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, Crosshair, LogOut, RotateCcw, Trophy, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


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

const getRoomById = (id: number) => tutorialMapLayout.find(r => r.id === id);

type GameOverReason = {
  icon: React.ElementType;
  title: string;
  description: string;
  variant: 'victory' | 'defeat';
} | null;


export default function TutorialPage() {
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<GameOverReason>(null);
  const [droneEvent, setDroneEvent] = useState<Room | null>(null);
  const [arrowsLeft, setArrowsLeft] = useState<number>(1);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set([1]));
  const router = useRouter();


  const handleMove = (newRoomId: number) => {
    if (gameOver) return;

    const newRoom = getRoomById(newRoomId);
    if (!newRoom) return;

    setVisitedRooms(prev => new Set(prev).add(newRoomId));
    setPlayerRoomId(newRoom.id);
    setIsShooting(false);

    // Check for hazards in the new room
    if (newRoom.hasWumpus) {
      setGameOver({
        icon: Skull,
        title: "Neutralizado por Activo Hostil",
        description: "El Activo 734 te ha encontrado. Misión fracasada.",
        variant: 'defeat',
      });
    } else if (newRoom.hasPit) {
      setGameOver({
        icon: AlertTriangle,
        title: "Peligro Estructural Fatal",
        description: "Has caído en un pozo de mantenimiento sin fondo. Misión fracasada.",
        variant: 'defeat',
      });
    } else if (newRoom.hasBat) {
      setDroneEvent(newRoom);
    }
  };

  const handleDroneTransport = () => {
    if (!droneEvent) return;

    let randomRoomId;
    do {
      randomRoomId = Math.floor(Math.random() * tutorialMapLayout.length) + 1;
    } while (randomRoomId === playerRoomId);
    
    setDroneEvent(null);
    handleMove(randomRoomId);
  };
  
  const handleShootClick = () => {
    if (gameOver || arrowsLeft === 0) return;
    setIsShooting(prev => !prev);
  };

  const handleShoot = (targetRoomId: number) => {
    if (!isShooting || arrowsLeft === 0 || gameOver) return;

    const targetRoom = getRoomById(targetRoomId);
    setArrowsLeft(prev => prev - 1);
    setIsShooting(false);

    if (targetRoom?.hasWumpus) {
      setGameOver({
        icon: Trophy,
        title: "Activo Neutralizado",
        description: "¡Has completado la misión, Extractor! El Activo 734 ha sido eliminado.",
        variant: 'victory',
      });
    } else {
      // Since arrows are now 0, this will trigger the loss condition.
       setGameOver({
        icon: Skull,
        title: "Munición Agotada",
        description: "Has fallado tu disparo. El activo, alertado, te ha localizado. Misión fracasada.",
        variant: 'defeat',
      });
    }
  };

  const restartGame = () => {
    setPlayerRoomId(1);
    setGameOver(null);
    setIsShooting(false);
    setArrowsLeft(1);
    setVisitedRooms(new Set([1]));
  };

  const { currentRoom, connectedRooms, senses } = useMemo(() => {
    const room = getRoomById(playerRoomId);
    if (!room) {
      // Fallback
      return { currentRoom: getRoomById(1)!, connectedRooms: getRoomById(1)!.connections, senses: [] };
    }
    const connections = room.connections;
    
    const senseTypes = {
        wumpus: { text: 'Alerta: Interferencia biológica.', icon: Skull, color: 'text-wumpus-danger', id: 'wumpus' },
        pit: { text: 'Peligro: Pozo estructural.', icon: AlertTriangle, color: 'text-wumpus-warning', id: 'pit' },
        bat: { text: 'Anomalía: Dron de transporte.', icon: Shuffle, color: 'text-wumpus-accent', id: 'bat' }
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
    <>
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
             <div className="space-y-1 text-xs font-code min-h-[60px]">
                {senses.length > 0 ? senses.map((sense, index) => (
                    <div key={`${sense.id}-${index}`} className={cn("flex items-center gap-2", sense.color)}>
                        <sense.icon className="h-4 w-4 flex-shrink-0"/>
                        <p>{sense.text}</p>
                    </div>
                )) : (
                  <p key="no-senses" className="text-wumpus-foreground/70 italic">
                    Sistemas estables. No hay peligros inmediatos.
                  </p>
                )}
             </div>
             <div className="mt-2 text-sm font-semibold flex items-center gap-2 text-wumpus-accent">
                <Crosshair className="h-4 w-4" />
                <span>Cañón de Pulso: {arrowsLeft}</span>
            </div>
             <Button className="w-full mt-4 bg-wumpus-primary/20 border border-wumpus-primary text-wumpus-primary hover:bg-wumpus-primary/30 hover:text-wumpus-primary" disabled={arrowsLeft === 0} variant={isShooting ? "destructive" : "outline"} onClick={handleShootClick} >
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
          const isVisited = visitedRooms.has(room.id);
          const isClickableForMove = isConnected && !isPlayerInRoom && !isShooting;
          const isClickableForShoot = isConnected && !isPlayerInRoom && isShooting;
          const isClickable = !gameOver && (isClickableForMove || isClickableForShoot);

          const hasHazard = room.hasWumpus || room.hasPit || room.hasBat;

          return (
            <div
              key={room.id}
              onClick={() => {
                if (!isClickable) return;
                if (isClickableForMove) handleMove(room.id);
                if (isClickableForShoot) handleShoot(room.id);
              }}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              className={cn(
                'relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 border border-wumpus-accent/20 text-wumpus-accent',
                'transition-all duration-200',
                isPlayerInRoom && 'bg-wumpus-primary/20 ring-2 ring-wumpus-primary text-wumpus-primary',
                isClickableForMove && 'bg-wumpus-accent/10 hover:bg-wumpus-accent/20 hover:border-wumpus-accent cursor-pointer',
                isClickableForShoot && 'bg-wumpus-danger/20 hover:bg-wumpus-danger/30 hover:border-wumpus-danger cursor-crosshair ring-1 ring-wumpus-danger',
                !isClickable && !isPlayerInRoom && 'bg-wumpus-background/50',
                 gameOver && 'cursor-not-allowed'
              )}
            >
              <div className="flex flex-col items-center justify-center">
                 {isPlayerInRoom && (
                    <>
                        <UserCog className="h-8 w-8" />
                    </>
                 )}
                 {/* En el modo tutorial, todos los peligros son visibles */}
                 {isVisited && room.hasWumpus && !isPlayerInRoom && <Skull className="h-8 w-8 text-wumpus-danger" />}
                 {isVisited && room.hasPit && !isPlayerInRoom && <AlertTriangle className="h-8 w-8 text-wumpus-warning" />}
                 {isVisited && room.hasBat && !isPlayerInRoom && <Shuffle className="h-8 w-8 text-wumpus-accent" />}
                 {isVisited && !isPlayerInRoom && !hasHazard && <Footprints className="h-8 w-8 text-wumpus-primary opacity-40" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
      {/* Modal de Game Over */}
      <AlertDialog open={!!gameOver}>
        <AlertDialogContent className={cn(
          "bg-wumpus-card text-wumpus-foreground border-wumpus-primary",
           gameOver?.variant === 'defeat' && "border-wumpus-danger shadow-glow-wumpus-danger",
           gameOver?.variant === 'victory' && "border-green-500 shadow-glow-wumpus-primary"
        )}>
          <AlertDialogHeader>
            {gameOver?.icon && <gameOver.icon className={cn("h-12 w-12 mx-auto", {
                'text-wumpus-danger': gameOver?.variant === 'defeat',
                'text-green-500': gameOver?.variant === 'victory',
            })} />}
            <AlertDialogTitle className={cn("text-center text-2xl", {
                'text-wumpus-danger': gameOver?.variant === 'defeat',
                'text-green-500': gameOver?.variant === 'victory',
            })}>{gameOver?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-wumpus-foreground/80">
              {gameOver?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => router.back()} className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
                <LogOut className="mr-2"/>
                Salir de la Simulación
            </Button>
            <Button onClick={restartGame} className="bg-wumpus-primary text-wumpus-primary-foreground hover:bg-wumpus-primary/90">
                <RotateCcw className="mr-2"/>
                {gameOver?.variant === 'victory' ? 'Jugar de Nuevo' : 'Reiniciar Misión'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Dron */}
      <AlertDialog open={!!droneEvent}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-wumpus-accent">
          <AlertDialogHeader>
            <Shuffle className="h-12 w-12 mx-auto text-wumpus-accent" />
            <AlertDialogTitle className="text-center text-2xl text-wumpus-accent">Dron de Transporte Activado</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-wumpus-foreground/80">
              Un dron de transporte errático te ha atrapado. ¡Prepárate para una reubicación forzada a una sección aleatoria de los túneles!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDroneTransport} className="w-full bg-wumpus-accent text-black hover:bg-wumpus-accent/80">
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
