
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, Crosshair, LogOut, RotateCcw, Trophy, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Typewriter } from '@/components/typewriter';


// Definición de la estructura de una habitación
type Room = {
  id: number;
  connections: number[];
  hasWumpus: boolean;
  hasPit: boolean;
  hasBat: boolean;
};


const generateMap = (): Room[] => {
    const size = 4;
    const roomCount = size * size;
    const rooms: Room[] = [];

    // 1. Create all rooms with their connections
    for (let i = 1; i <= roomCount; i++) {
        const connections: number[] = [];
        const row = Math.floor((i - 1) / size);
        const col = (i - 1) % size;

        if (col > 0) connections.push(i - 1); // Left
        if (col < size - 1) connections.push(i + 1); // Right
        if (row > 0) connections.push(i - size); // Top
        if (row < size - 1) connections.push(i + size); // Bottom

        rooms.push({
            id: i,
            connections,
            hasWumpus: false,
            hasPit: false,
            hasBat: false,
        });
    }

    // 2. Place hazards randomly
    const playerStartRoom = 1;
    let availableRooms = rooms.map(r => r.id).filter(id => id !== playerStartRoom);
    
    const placeItem = (itemType: 'wumpus' | 'pit' | 'bat') => {
        const randomIndex = Math.floor(Math.random() * availableRooms.length);
        const roomId = availableRooms[randomIndex];
        availableRooms.splice(randomIndex, 1); // Remove room from available pool
        
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            if (itemType === 'wumpus') room.hasWumpus = true;
            if (itemType === 'pit') room.hasPit = true;
            if (itemType === 'bat') room.hasBat = true;
        }
    };
    
    placeItem('wumpus');
    placeItem('pit');
    placeItem('pit');
    placeItem('bat');
    placeItem('bat');

    return rooms;
}


type GameOverReason = {
  icon: React.ElementType;
  title: string;
  description: string;
  variant: 'victory' | 'defeat';
} | null;

type PendingAction = 'transportByDrone' | null;

export default function EasyPracticePage() {
  const [gameMap, setGameMap] = useState<Room[]>([]);
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<GameOverReason>(null);
  const [droneEvent, setDroneEvent] = useState<boolean>(false);
  const [arrowsLeft, setArrowsLeft] = useState<number>(3);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set([1]));
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const router = useRouter();


  useEffect(() => {
    if (pendingAction === 'transportByDrone') {
      handleDroneTransport();
      setPendingAction(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction]);

  const getRoomById = (id: number) => gameMap.find(r => r.id === id);


  const handleMove = (newRoomId: number) => {
    if (gameOver || gameMap.length === 0) return;

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
      setDroneEvent(true);
    }
  };

  const handleDroneTransport = () => {
    let randomRoomId;
    let newRoom;
    do {
      randomRoomId = Math.floor(Math.random() * gameMap.length) + 1;
      newRoom = getRoomById(randomRoomId);
    } while (randomRoomId === playerRoomId || !newRoom);
    
    setVisitedRooms(prev => new Set(prev).add(newRoom.id));
    setPlayerRoomId(newRoom.id);

    // Check for hazards in the new landing spot
    if (newRoom.hasWumpus) {
      setGameOver({ icon: Skull, title: "Entrega Mortal", description: "El dron te ha dejado justo en la boca del Activo 734. Misión fracasada.", variant: 'defeat' });
    } else if (newRoom.hasPit) {
      setGameOver({ icon: AlertTriangle, title: "Caída Inesperada", description: "El dron te ha soltado sobre un pozo sin fondo. Misión fracasada.", variant: 'defeat' });
    } else if (newRoom.hasBat) {
      // Landed on another bat, trigger again!
      setDroneEvent(true);
    }
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
    } else if (arrowsLeft - 1 === 0) {
       setGameOver({
        icon: Skull,
        title: "Munición Agotada",
        description: "Has fallado tu último disparo. El activo, alertado, te ha localizado. Misión fracasada.",
        variant: 'defeat',
      });
    }
  };

  const restartGame = () => {
    setGameMap(generateMap());
    setPlayerRoomId(1);
    setGameOver(null);
    setIsShooting(false);
    setArrowsLeft(3);
    setVisitedRooms(new Set([1]));
    setDroneEvent(false);
  };
  
  useEffect(() => {
    restartGame();
  }, []);

  const { connectedRooms, senses } = useMemo(() => {
    if (gameMap.length === 0) return { currentRoom: null, connectedRooms: [], senses: [] };
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

    return { connectedRooms: connections, senses: senses_warnings };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRoomId, gameMap]);

  if (gameMap.length === 0) {
    return null; // Or a loading indicator
  }

  return (
    <>
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex items-center justify-center p-4">
       {/* Botón de Salir */}
      <Button variant="ghost" size="icon" onClick={() => router.back()} className="absolute top-4 right-4 text-wumpus-accent hover:text-wumpus-primary hover:bg-wumpus-primary/10 z-10">
          <LogOut className="h-6 w-6" />
      </Button>
      
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Panel de Información */}
        <div className="w-full max-w-md">
            <Card className="bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-wumpus-primary"><UserCog />Estado del Extractor</CardTitle>
                <CardDescription className="text-wumpus-foreground/60">Simulación: Práctica Fácil</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 text-xs font-code min-h-[60px]">
                    {senses.length > 0 ? senses.map((sense, index) => (
                        <div key={`${sense.id}-${index}`} className={cn("flex items-center gap-2", sense.color)}>
                            <sense.icon className="h-4 w-4 flex-shrink-0"/>
                            <Typewriter text={sense.text} />
                        </div>
                    )) : (
                    <p key="no-senses" className="text-wumpus-foreground/70 italic">
                        <Typewriter text="Sistemas estables. No hay peligros inmediatos." />
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
            {gameMap.map(room => {
            const isPlayerInRoom = playerRoomId === room.id;
            const isConnected = connectedRooms.includes(room.id);
            const isVisited = visitedRooms.has(room.id);
            const isClickableForMove = isConnected && !isPlayerInRoom && !isShooting;
            const isClickableForShoot = isConnected && !isPlayerInRoom && isShooting;
            const isClickable = !gameOver && (isClickableForMove || isClickableForShoot);
            
            const hasVisibleHazard = room.hasPit || room.hasBat;

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
                    'relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 border border-wumpus-accent/20 text-wumpus-accent',
                    'transition-all duration-200',
                    isPlayerInRoom && 'bg-wumpus-primary/20 ring-2 ring-wumpus-primary text-wumpus-primary',
                    isClickableForMove && 'bg-wumpus-accent/10 hover:bg-wumpus-accent/20 hover:border-wumpus-accent cursor-pointer',
                    isClickableForShoot && 'bg-wumpus-danger/20 hover:bg-wumpus-danger/30 hover:border-wumpus-danger cursor-crosshair ring-1 ring-wumpus-danger',
                    !isClickable && !isPlayerInRoom && 'bg-wumpus-background/50',
                    gameOver && 'cursor-not-allowed'
                )}
                >
                <div className="flex flex-col items-center justify-center">
                    {isPlayerInRoom && <UserCog className="h-8 w-8" />}
                    
                    {!isPlayerInRoom && (
                    <>
                        {room.hasWumpus && <Skull className="h-8 w-8 text-wumpus-danger" />}
                        {room.hasPit && <AlertTriangle className="h-8 w-8 text-wumpus-warning" />}
                        {room.hasBat && <Shuffle className="h-8 w-8 text-wumpus-accent" />}
                        {isVisited && !hasVisibleHazard && !room.hasWumpus && <Footprints className="h-8 w-8 text-wumpus-primary opacity-40" />}
                    </>
                    )}
                </div>
                </div>
            );
            })}
        </div>
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
      <AlertDialog open={droneEvent}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-wumpus-accent">
          <AlertDialogHeader>
            <Shuffle className="h-12 w-12 mx-auto text-wumpus-accent" />
            <AlertDialogTitle className="text-center text-2xl text-wumpus-accent">Dron de Transporte Activado</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-wumpus-foreground/80">
              Un dron de transporte errático te ha atrapado. ¡Prepárate para una reubicación forzada a una sección aleatoria de los túneles!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => {
                setDroneEvent(false);
                setPendingAction('transportByDrone');
              }} 
              className="w-full bg-wumpus-accent text-black hover:bg-wumpus-accent/80"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    