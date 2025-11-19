
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, Crosshair, LogOut, RotateCcw, Trophy, WifiOff, ShieldAlert, Footprints } from 'lucide-react';
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
  hasStatic: boolean;
  hasLockdown: boolean;
};

// Generar un mapa aleatorio de 5x5
const generateMap = (): Room[] => {
    const size = 5;
    const roomCount = size * size;
    const rooms: Room[] = [];

    // 1. Crear todas las habitaciones con sus conexiones
    for (let i = 1; i <= roomCount; i++) {
        const connections: number[] = [];
        const row = Math.floor((i - 1) / size);
        const col = (i - 1) % size;

        if (col > 0) connections.push(i - 1); // Izquierda
        if (col < size - 1) connections.push(i + 1); // Derecha
        if (row > 0) connections.push(i - size); // Arriba
        if (row < size - 1) connections.push(i + size); // Abajo

        rooms.push({
            id: i,
            connections,
            hasWumpus: false,
            hasPit: false,
            hasBat: false,
            hasStatic: false,
            hasLockdown: false,
        });
    }

    // 2. Colocar peligros aleatoriamente
    const playerStartRoom = 1;
    let availableRooms = rooms.map(r => r.id).filter(id => id !== playerStartRoom);
    
    const placeItem = (itemType: 'wumpus' | 'pit' | 'bat' | 'static' | 'lockdown') => {
        if (availableRooms.length === 0) return;
        const randomIndex = Math.floor(Math.random() * availableRooms.length);
        const roomId = availableRooms[randomIndex];
        availableRooms.splice(randomIndex, 1); // Eliminar la habitación del grupo disponible
        
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            if (itemType === 'wumpus') room.hasWumpus = true;
            else if (itemType === 'pit') room.hasPit = true;
            else if (itemType === 'bat') room.hasBat = true;
            else if (itemType === 'static') room.hasStatic = true;
            else if (itemType === 'lockdown') room.hasLockdown = true;
        }
    };
    
    placeItem('wumpus');
    placeItem('pit');
    placeItem('pit');
    placeItem('bat');
    placeItem('bat');
    placeItem('static');
    placeItem('static');
    placeItem('lockdown');
    placeItem('lockdown');

    return rooms;
}

type GameOverReason = {
  icon: React.ElementType;
  title: string;
  description: string;
  variant: 'victory' | 'defeat';
} | null;

type AlertModalReason = {
    icon: React.ElementType;
    title: string;
    description: string;
    buttonText: string;
    onConfirm: () => void;
} | null;

export default function IntermediatePracticePage() {
  const [gameMap, setGameMap] = useState<Room[]>([]);
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<GameOverReason>(null);
  const [alertModal, setAlertModal] = useState<AlertModalReason>(null);
  const [lockdownEvent, setLockdownEvent] = useState<boolean>(false);
  const [lockdownContinue, setLockdownContinue] = useState<boolean>(false);
  const [arrowsLeft, setArrowsLeft] = useState<number>(4);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set([1]));
  const router = useRouter();

  const getRoomById = useCallback((id: number) => gameMap.find(r => r.id === id), [gameMap]);

  const moveWumpus = useCallback((currentMap: Room[]) => {
    const wumpusRoom = currentMap.find(r => r.hasWumpus);
    if (!wumpusRoom) return { newMap: currentMap, wumpusFell: false };

    const wumpusConnections = wumpusRoom.connections;
    if (wumpusConnections.length === 0) return { newMap: currentMap, wumpusFell: false };
    
    const newWumpusRoomId = wumpusConnections[Math.floor(Math.random() * wumpusConnections.length)];
    
    let tempMap = currentMap.map(r => r.id === wumpusRoom.id ? { ...r, hasWumpus: false } : r);
    
    const newWumpusRoom = tempMap.find(r => r.id === newWumpusRoomId)!;

    if (newWumpusRoom.hasPit) {
        setGameOver({
            icon: Trophy, title: "Activo Neutralizado por el Entorno",
            description: "¡Has tenido suerte! El Activo 734 se movió y cayó en un pozo sin fondo.", variant: 'victory',
        });
        return { newMap: tempMap, wumpusFell: true };
    }

    if (newWumpusRoom.id === playerRoomId) {
        setGameOver({
            icon: Skull, title: "¡Te ha encontrado!",
            description: "El Activo 734 se ha movido a tu ubicación. Misión fracasada.", variant: 'defeat',
        });
        return { newMap: tempMap, wumpusFell: true };
    }

    if (newWumpusRoom.hasBat) {
        let finalRoomId;
        do {
            finalRoomId = Math.floor(Math.random() * tempMap.length) + 1;
        } while (finalRoomId === newWumpusRoomId || finalRoomId === playerRoomId);

        if (finalRoomId === playerRoomId) {
            setGameOver({
                icon: Skull, title: "Entrega Mortal",
                description: "Un dron transportó al Activo 734 directamente a tu ubicación. Misión fracasada.", variant: 'defeat',
            });
             return { newMap: tempMap, wumpusFell: true };
        }
        tempMap = tempMap.map(r => r.id === finalRoomId ? { ...r, hasWumpus: true } : r);
    } else {
        tempMap = tempMap.map(r => r.id === newWumpusRoomId ? { ...r, hasWumpus: true } : r);
    }

    return { newMap: tempMap, wumpusFell: false };
}, [playerRoomId]);

  const checkHazards = useCallback((room: Room, map: Room[]): boolean => {
    if (room.hasWumpus) {
      setGameOver({
        icon: Skull,
        title: "Neutralizado por Activo Hostil",
        description: "El Activo 734 te ha encontrado. Misión fracasada.",
        variant: 'defeat',
      });
      return true;
    }
    if (room.hasPit) {
      setGameOver({
        icon: AlertTriangle,
        title: "Peligro Estructural Fatal",
        description: "Has caído en un pozo de mantenimiento sin fondo. Misión fracasada.",
        variant: 'defeat',
      });
      return true;
    }
    if (room.hasBat) {
      setAlertModal({
          icon: Shuffle, title: "Dron de Transporte Activado",
          description: "Un dron de transporte errático te ha atrapado. ¡Prepárate para una reubicación forzada!",
          buttonText: "Continuar",
          onConfirm: () => { setAlertModal(null); handleDroneTransport(map); }
      });
      return false; // El evento de dron no es una derrota inmediata
    }
    if (room.hasLockdown) {
      setLockdownEvent(true);
      setLockdownContinue(false);
      setTimeout(() => setLockdownContinue(true), 2000); // 2 segundos de bloqueo
      return false;
    }
    return false;
  }, [getRoomById]);

  const handleDroneTransport = (currentMap: Room[]) => {
    let randomRoomId;
    let newRoom;
    do {
      randomRoomId = Math.floor(Math.random() * currentMap.length) + 1;
      newRoom = getRoomById(randomRoomId);
    } while (randomRoomId === playerRoomId || !newRoom);
    
    setVisitedRooms(prev => new Set(prev).add(newRoom.id));
    setPlayerRoomId(newRoom.id);
    checkHazards(newRoom, currentMap);
  };

  const handleMove = useCallback((newRoomId: number) => {
    if (gameOver || gameMap.length === 0) return;

    const newRoom = getRoomById(newRoomId);
    if (!newRoom) return;

    setVisitedRooms(prev => new Set(prev).add(newRoomId));
    setPlayerRoomId(newRoom.id);
    setIsShooting(false);
    
    let currentMap = gameMap;
    let wumpusMoved = false;

    // 25% chance for Wumpus to move
    if (Math.random() < 0.25) {
        const { newMap, wumpusFell } = moveWumpus(currentMap);
        currentMap = newMap;
        setGameMap(newMap);
        if (!wumpusFell) {
            wumpusMoved = true;
        } else {
             // Wumpus fell or game over, no need to check other hazards
            return;
        }
    }
    
    const isGameOver = checkHazards(newRoom, currentMap);

    if (!isGameOver && wumpusMoved) {
        setAlertModal({
            icon: AlertTriangle,
            title: "¡Temblor Detectado!",
            description: "Sientes un temblor en la estructura. El activo podría haberse movido.",
            buttonText: "Entendido",
            onConfirm: () => setAlertModal(null)
        });
    }

  }, [gameOver, gameMap, getRoomById, checkHazards, moveWumpus]);
  
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
        const { newMap: movedMap, wumpusFell } = moveWumpus(gameMap);
        if (!wumpusFell) {
            setGameMap(movedMap);
            setAlertModal({
                icon: Skull, title: "Disparo Fallido: ¡El Activo se Mueve!",
                description: "Has fallado. El activo, alertado, se ha reposicionado. La caza continúa, pero ahora eres la presa.",
                buttonText: "Entendido",
                onConfirm: () => {
                    setAlertModal(null);
                    if (arrowsLeft - 1 === 0 && !gameOver) {
                        setGameOver({
                            icon: Skull, title: "Munición Agotada",
                            description: "Te has quedado sin munición. Sin forma de defenderte, eres un blanco fácil. Misión fracasada.", variant: 'defeat',
                        });
                    }
                }
            });
        }
    }
  };

  const restartGame = useCallback(() => {
    const newMap = generateMap();
    setGameMap(newMap);
    setPlayerRoomId(1);
    setGameOver(null);
    setIsShooting(false);
    setArrowsLeft(4);
    setLockdownEvent(false);
    setAlertModal(null);
    setVisitedRooms(new Set([1]));
  }, []);

  useEffect(() => {
    restartGame();
  }, [restartGame]);

  const { connectedRooms, senses, isInStatic } = useMemo(() => {
    if (gameMap.length === 0) return { connectedRooms: [], senses: [], isInStatic: false };
    const room = getRoomById(playerRoomId);
    if (!room) return { connectedRooms: [], senses: [], isInStatic: false };
    
    const inStatic = room.hasStatic;
    let connections = room.connections;
    if (lockdownEvent) {
      connections = []; // Sin conexiones durante el bloqueo
    }
    
    const senseTypes = {
        wumpus: { text: 'Alerta: Interferencia biológica.', icon: Skull, color: 'text-wumpus-danger', id: 'wumpus' },
        pit: { text: 'Peligro: Pozo estructural.', icon: AlertTriangle, color: 'text-wumpus-warning', id: 'pit' },
        bat: { text: 'Anomalía: Dron de transporte.', icon: Shuffle, color: 'text-wumpus-accent', id: 'bat' },
        static: { text: 'Ruido de señal cercano.', icon: WifiOff, color: 'text-gray-400', id: 'static' },
        lockdown: { text: 'Lectura de energía residual.', icon: ShieldAlert, color: 'text-orange-400', id: 'lockdown' }
    };

    const senses_warnings: { text: string; icon: React.ElementType; color: string, id: string }[] = [];
    const detectedSenses = new Set();

    if (!inStatic) {
        for (const connectedId of room.connections) {
            const connectedRoom = getRoomById(connectedId);
            if (connectedRoom) {
                if (connectedRoom.hasWumpus && !detectedSenses.has('wumpus')) { senses_warnings.push(senseTypes.wumpus); detectedSenses.add('wumpus'); }
                if (connectedRoom.hasPit && !detectedSenses.has('pit')) { senses_warnings.push(senseTypes.pit); detectedSenses.add('pit'); }
                if (connectedRoom.hasBat && !detectedSenses.has('bat')) { senses_warnings.push(senseTypes.bat); detectedSenses.add('bat'); }
                if (connectedRoom.hasStatic && !detectedSenses.has('static')) { senses_warnings.push(senseTypes.static); detectedSenses.add('static'); }
                if (connectedRoom.hasLockdown && !detectedSenses.has('lockdown')) { senses_warnings.push(senseTypes.lockdown); detectedSenses.add('lockdown'); }
            }
        }
    }

    return { connectedRooms: connections, senses: senses_warnings, isInStatic: inStatic };
  }, [playerRoomId, gameMap, getRoomById, lockdownEvent]);

  if (gameMap.length === 0) {
    return null; // O un indicador de carga
  }

  return (
    <>
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex flex-col md:flex-row items-center justify-center gap-8 p-4 relative">
      <Button variant="ghost" size="icon" onClick={() => router.back()} className="absolute top-4 right-4 text-wumpus-accent hover:text-wumpus-primary hover:bg-wumpus-primary/10">
          <LogOut className="h-6 w-6" />
      </Button>
      
      <div className="w-full md:w-1/4 max-w-sm">
        <Card className="bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-wumpus-primary"><UserCog />Estado del Extractor</CardTitle>
            <CardDescription className="text-wumpus-foreground/60">Simulación: Práctica Intermedia</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-1 text-xs font-code min-h-[90px]">
                {isInStatic ? (
                  <p className="text-orange-400 italic flex items-center gap-2"><WifiOff /> <Typewriter text="ERROR: Interferencia de sensor." /></p>
                ) : senses.length > 0 ? senses.map((sense, index) => (
                    <div key={`${sense.id}-${index}`} className={cn("flex items-center gap-2", sense.color)}>
                        <sense.icon className="h-4 w-4 flex-shrink-0"/>
                        <Typewriter text={sense.text} />
                    </div>
                )) : (
                  <p className="text-wumpus-foreground/70 italic"><Typewriter text="Sistemas estables. No hay peligros inmediatos." /></p>
                )}
             </div>
             <div className="mt-2 text-sm font-semibold flex items-center gap-2 text-wumpus-accent">
                <Crosshair className="h-4 w-4" />
                <span>Cañón de Pulso: {arrowsLeft}</span>
            </div>
             <Button className="w-full mt-4 bg-wumpus-primary/20 border border-wumpus-primary text-wumpus-primary hover:bg-wumpus-primary/30 hover:text-wumpus-primary" disabled={arrowsLeft === 0 || lockdownEvent} variant={isShooting ? "destructive" : "outline"} onClick={handleShootClick} >
                <Crosshair className="mr-2 h-4 w-4" />
                {isShooting ? 'Apuntando...' : 'Armar Cañón de Pulso'}
             </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-5 gap-1 bg-black/30 p-2 rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary">
        {gameMap.map(room => {
          const isPlayerInRoom = playerRoomId === room.id;
          const isConnected = connectedRooms.includes(room.id);
          const isVisited = visitedRooms.has(room.id);
          const isClickableForMove = isConnected && !isPlayerInRoom && !isShooting;
          const isClickableForShoot = isConnected && !isPlayerInRoom && isShooting;
          const isClickable = !gameOver && (isClickableForMove || isClickableForShoot);

          const hasVisibleHazard = room.hasPit || room.hasBat || room.hasStatic || room.hasLockdown || room.hasWumpus;

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
                gameOver && 'cursor-not-allowed',
                lockdownEvent && isConnected && 'cursor-not-allowed bg-red-900/50'
              )}
            >
              <div className="flex flex-col items-center justify-center">
                 {isPlayerInRoom && <UserCog className="h-8 w-8" />}
                 
                 {!isPlayerInRoom && (
                   <>
                     {room.hasWumpus && <Skull className="h-8 w-8 text-wumpus-danger" />}
                     {room.hasPit && <AlertTriangle className="h-8 w-8 text-wumpus-warning" />}
                     {room.hasBat && <Shuffle className="h-8 w-8 text-wumpus-accent" />}
                     {room.hasStatic && <WifiOff className="h-8 w-8 text-gray-400" />}
                     {room.hasLockdown && <ShieldAlert className="h-8 w-8 text-orange-400" />}
                     {isVisited && !hasVisibleHazard && <Footprints className="h-8 w-8 text-wumpus-primary opacity-40" />}
                   </>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
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

      <AlertDialog open={!!alertModal}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-wumpus-accent">
          <AlertDialogHeader>
            {alertModal?.icon && <alertModal.icon className="h-12 w-12 mx-auto text-wumpus-accent" />}
            <AlertDialogTitle className="text-center text-2xl text-wumpus-accent">{alertModal?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-wumpus-foreground/80">
              {alertModal?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={alertModal?.onConfirm} className="w-full bg-wumpus-accent text-black hover:bg-wumpus-accent/80">
              {alertModal?.buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={lockdownEvent}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-orange-400">
          <AlertDialogHeader>
            <ShieldAlert className="h-12 w-12 mx-auto text-orange-400" />
            <AlertDialogTitle className="text-center text-2xl text-orange-400">Protocolo de Bloqueo Activado</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-wumpus-foreground/80">
              Has activado una trampa de contención. Las rutas de salida están selladas temporalmente. Espera...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setLockdownEvent(false)} className="w-full" disabled={!lockdownContinue}>
              {lockdownContinue ? 'Continuar' : 'Bloqueado...'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
