'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, Crosshair, LogOut, RotateCcw, Trophy, WifiOff, ShieldAlert, Footprints, Ghost, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Typewriter } from '@/components/typewriter';
import { AnimatedLoading } from '@/components/animated-loading';


// Game Structure Definitions
type Room = {
  id: number;
  connections: number[];
  hasWumpus: boolean;
  hasPit: boolean;
  hasBat: boolean;
  hasStatic: boolean;
  hasLockdown: boolean;
  hasGhost: boolean;
};

type LevelConfig = {
  level: number;
  gridSize: number;
  arrows: number;
  wumpusCount: number;
  pitCount: number;
  batCount: number;
  staticCount: number;
  lockdownCount: number;
  ghostCount: number;
  wumpusMoveChance: number; // Probability (0 to 1)
};

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

type PendingAction = 'transportByDrone' | 'moveWumpus' | null;
type WumpusStatus = 'DORMIDO' | 'EN MOVIMIENTO' | 'REUBICADO POR DRON';

// Level Configurations
const levelConfigs: LevelConfig[] = [
  { level: 1, gridSize: 3, arrows: 2, wumpusCount: 1, pitCount: 1, batCount: 1, staticCount: 0, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0.1 },
  { level: 2, gridSize: 3, arrows: 3, wumpusCount: 1, pitCount: 2, batCount: 1, staticCount: 0, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0.15 },
  { level: 3, gridSize: 4, arrows: 3, wumpusCount: 1, pitCount: 2, batCount: 2, staticCount: 1, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0.2 },
  { level: 4, gridSize: 4, arrows: 3, wumpusCount: 1, pitCount: 3, batCount: 2, staticCount: 2, lockdownCount: 1, ghostCount: 0, wumpusMoveChance: 0.25 },
  { level: 5, gridSize: 5, arrows: 4, wumpusCount: 1, pitCount: 3, batCount: 2, staticCount: 2, lockdownCount: 2, ghostCount: 1, wumpusMoveChance: 0.3 },
  { level: 6, gridSize: 5, arrows: 4, wumpusCount: 1, pitCount: 4, batCount: 3, staticCount: 2, lockdownCount: 2, ghostCount: 1, wumpusMoveChance: 0.35 },
  { level: 7, gridSize: 6, arrows: 4, wumpusCount: 1, pitCount: 4, batCount: 3, staticCount: 3, lockdownCount: 2, ghostCount: 2, wumpusMoveChance: 0.4 },
  { level: 8, gridSize: 6, arrows: 5, wumpusCount: 1, pitCount: 5, batCount: 4, staticCount: 3, lockdownCount: 3, ghostCount: 2, wumpusMoveChance: 0.45 },
  { level: 9, gridSize: 7, arrows: 5, wumpusCount: 1, pitCount: 5, batCount: 4, staticCount: 4, lockdownCount: 3, ghostCount: 3, wumpusMoveChance: 0.5 },
  { level: 10, gridSize: 7, arrows: 5, wumpusCount: 1, pitCount: 6, batCount: 5, staticCount: 4, lockdownCount: 4, ghostCount: 3, wumpusMoveChance: 0.6 },
];


// Dynamic Map Generation
const generateMap = (config: LevelConfig): Room[] => {
    const { gridSize, wumpusCount, pitCount, batCount, staticCount, lockdownCount, ghostCount } = config;
    const roomCount = gridSize * gridSize;
    const rooms: Room[] = [];

    // 1. Create all rooms with connections
    for (let i = 1; i <= roomCount; i++) {
        const connections: number[] = [];
        const row = Math.floor((i - 1) / gridSize);
        const col = (i - 1) % gridSize;

        if (col > 0) connections.push(i - 1);
        if (col < gridSize - 1) connections.push(i + 1);
        if (row > 0) connections.push(i - gridSize);
        if (row < gridSize - 1) connections.push(i + gridSize);

        rooms.push({ id: i, connections, hasWumpus: false, hasPit: false, hasBat: false, hasStatic: false, hasLockdown: false, hasGhost: false });
    }

    // 2. Place hazards
    const playerStartRoom = 1;
    let availableRooms = rooms.map(r => r.id).filter(id => id !== playerStartRoom);
    
    const placeItems = (itemType: keyof Omit<Room, 'id' | 'connections'>, count: number) => {
        for (let i = 0; i < count; i++) {
            if (availableRooms.length === 0) return;
            const randomIndex = Math.floor(Math.random() * availableRooms.length);
            const roomId = availableRooms[randomIndex];
            availableRooms.splice(randomIndex, 1);
            
            const room = rooms.find(r => r.id === roomId);
            if (room) {
                 (room as any)[itemType] = true;
            }
        }
    };
    
    placeItems('hasWumpus', wumpusCount);
    placeItems('hasPit', pitCount);
    placeItems('hasBat', batCount);
    placeItems('hasStatic', staticCount);
    placeItems('hasLockdown', lockdownCount);
    placeItems('hasGhost', ghostCount);

    return rooms;
}

export default function HuntLevelPage() {
  const router = useRouter();
  const params = useParams();
  const level = parseInt(params.level as string, 10);
  const config = useMemo(() => levelConfigs.find(c => c.level === level) || levelConfigs[0], [level]);

  const [gameMap, setGameMap] = useState<Room[]>([]);
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<GameOverReason>(null);
  const [alertModal, setAlertModal] = useState<AlertModalReason>(null);
  const [lockdownEvent, setLockdownEvent] = useState<boolean>(false);
  const [lockdownContinue, setLockdownContinue] = useState<boolean>(false);
  const [arrowsLeft, setArrowsLeft] = useState<number>(config.arrows);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set([1]));
  const [wumpusStatus, setWumpusStatus] = useState<WumpusStatus>('DORMIDO');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const getRoomById = useCallback((id: number, currentMap: Room[]) => currentMap.find(r => r.id === id), []);

  const moveWumpus = useCallback(() => {
    setGameMap(currentMap => {
        const wumpusRoom = currentMap.find(r => r.hasWumpus);
        if (!wumpusRoom) return currentMap;

        const wumpusConnections = wumpusRoom.connections;
        if (wumpusConnections.length === 0) return currentMap;

        const newWumpusRoomId = wumpusConnections[Math.floor(Math.random() * wumpusConnections.length)];
        let tempMap = currentMap.map(r => r.id === wumpusRoom.id ? { ...r, hasWumpus: false } : r);
        const newWumpusRoom = tempMap.find(r => r.id === newWumpusRoomId)!;

        if (newWumpusRoom.hasPit) {
            setGameOver({
                icon: Trophy, title: "Activo Neutralizado por el Entorno",
                description: "¡Has tenido suerte! El Activo 734 se movió y cayó en un pozo sin fondo.", variant: 'victory',
            });
            return tempMap.map(r => ({ ...r, hasWumpus: false }));
        }

        if (newWumpusRoom.id === playerRoomId) {
            setGameOver({
                icon: Skull, title: "¡Te ha encontrado!",
                description: "El Activo 734 se ha movido a tu ubicación. Misión fracasada.", variant: 'defeat',
            });
            return tempMap;
        }

        if (newWumpusRoom.hasBat) {
            setWumpusStatus('REUBICADO POR DRON');
            let finalRoomId;
            do {
                finalRoomId = Math.floor(Math.random() * tempMap.length) + 1;
            } while (finalRoomId === newWumpusRoomId || finalRoomId === playerRoomId);

            if (finalRoomId === playerRoomId) {
                setGameOver({
                    icon: Skull, title: "Entrega Mortal",
                    description: "Un dron transportó al Activo 734 directamente a tu ubicación. Misión fracasada.", variant: 'defeat',
                });
                return tempMap;
            }
            return tempMap.map(r => r.id === finalRoomId ? { ...r, hasWumpus: true } : r);
        } else {
            setWumpusStatus('EN MOVIMIENTO');
            return tempMap.map(r => r.id === newWumpusRoomId ? { ...r, hasWumpus: true } : r);
        }
    });
  }, [playerRoomId]);

  const checkHazards = useCallback((room: Room) => {
    if (room.hasWumpus) {
      setGameOver({
        icon: Skull, title: "Neutralizado por Activo Hostil",
        description: "El Activo 734 te ha encontrado. Misión fracasada.", variant: 'defeat',
      });
      return true;
    }
    if (room.hasPit) {
      setGameOver({
        icon: AlertTriangle, title: "Peligro Estructural Fatal",
        description: "Has caído en un pozo de mantenimiento sin fondo. Misión fracasada.", variant: 'defeat',
      });
      return true;
    }
    if (room.hasBat) {
      setAlertModal({
          icon: Shuffle, title: "Dron de Transporte Activado",
          description: "Un dron de transporte errático te ha atrapado. ¡Prepárate para una reubicación forzada!",
          buttonText: "Continuar",
          onConfirm: () => setPendingAction('transportByDrone'),
      });
      return false;
    }
    if (room.hasLockdown) {
      setLockdownEvent(true);
      setLockdownContinue(false);
      setTimeout(() => setLockdownContinue(true), 2000); // 2-second lockdown
      return false;
    }
    return false;
  }, []);

  const handleDroneTransport = useCallback(() => {
    setGameMap(currentMap => {
        let randomRoomId;
        let newRoom;
        do {
            randomRoomId = Math.floor(Math.random() * currentMap.length) + 1;
            newRoom = getRoomById(randomRoomId, currentMap);
        } while (randomRoomId === playerRoomId || !newRoom);

        setVisitedRooms(prev => new Set(prev).add(newRoom.id));
        setPlayerRoomId(newRoom.id);
        
        setTimeout(() => checkHazards(newRoom!), 0);
        
        return currentMap;
    });
  }, [playerRoomId, getRoomById, checkHazards]);

  useEffect(() => {
    if (pendingAction === 'transportByDrone') {
        handleDroneTransport();
        setPendingAction(null);
    } else if (pendingAction === 'moveWumpus') {
        moveWumpus();
        setPendingAction(null);
    }
  }, [pendingAction, handleDroneTransport, moveWumpus]);

  const handleMove = useCallback((newRoomId: number) => {
    if (gameOver || gameMap.length === 0) return;

    if (!isGameStarted) setIsGameStarted(true);

    const newRoom = getRoomById(newRoomId, gameMap);
    if (!newRoom) return;

    setWumpusStatus('DORMIDO');
    setVisitedRooms(prev => new Set(prev).add(newRoomId));
    setPlayerRoomId(newRoom.id);
    setIsShooting(false);

    if (isGameStarted && Math.random() < config.wumpusMoveChance) {
        setPendingAction('moveWumpus');
    }
    
    checkHazards(newRoom);
  }, [gameOver, gameMap, getRoomById, checkHazards, isGameStarted, config.wumpusMoveChance]);
  
  const handleShootClick = () => {
    if (gameOver || arrowsLeft === 0) return;
    setIsShooting(prev => !prev);
  };
  
  const handleShoot = (targetRoomId: number) => {
    if (!isShooting || arrowsLeft === 0 || gameOver) return;
  
    setArrowsLeft(prev => prev - 1);
    setIsShooting(false);
    
    const targetRoom = getRoomById(targetRoomId, gameMap);

    if (targetRoom?.hasWumpus) {
      setGameOver({
        icon: Trophy,
        title: "Activo Neutralizado",
        description: `¡Has completado la misión del Sector ${String(level).padStart(2, '0')}! El Activo 734 ha sido eliminado.`,
        variant: 'victory',
      });
      return;
    }
    
    setPendingAction('moveWumpus');
    if (arrowsLeft - 1 === 0 && !gameOver) {
      setGameOver({
        icon: Skull,
        title: "Munición Agotada",
        description: "Te has quedado sin munición. Sin forma de defenderte, eres un blanco fácil. Misión fracasada.",
        variant: 'defeat',
      });
    }
  };

  const restartGame = useCallback(() => {
    const newMap = generateMap(config);
    setGameMap(newMap);
    setPlayerRoomId(1);
    setGameOver(null);
    setIsShooting(false);
    setArrowsLeft(config.arrows);
    setLockdownEvent(false);
    setWumpusStatus('DORMIDO');
    setVisitedRooms(new Set([1]));
    setAlertModal(null);
    setIsGameStarted(false);
    setPendingAction(null);
  }, [config]);

  useEffect(() => {
    restartGame();
  }, [restartGame]);

  const { connectedRooms, senses, isInStatic } = useMemo(() => {
    if (gameMap.length === 0) return { connectedRooms: [], senses: [], isInStatic: false, isNearGhost: false };
    const room = getRoomById(playerRoomId, gameMap);
    if (!room) return { connectedRooms: [], senses: [], isInStatic: false, isNearGhost: false };
    
    const inStatic = room.hasStatic;
    let connections = room.connections;
    if (lockdownEvent) connections = [];
    
    const senseTypes = {
        wumpus: { text: 'Alerta: Interferencia biológica.', icon: Skull, color: 'text-wumpus-danger', id: 'wumpus' },
        pit: { text: 'Peligro: Pozo estructural.', icon: AlertTriangle, color: 'text-wumpus-warning', id: 'pit' },
        bat: { text: 'Anomalía: Dron de transporte.', icon: Shuffle, color: 'text-wumpus-accent', id: 'bat' },
        static: { text: 'Ruido de señal cercano.', icon: WifiOff, color: 'text-gray-400', id: 'static' },
        lockdown: { text: 'Lectura de energía residual.', icon: ShieldAlert, color: 'text-orange-400', id: 'lockdown' },
        ghost: { text: 'Lecturas de datos anómalas.', icon: Ghost, color: 'text-purple-400', id: 'ghost' },
    };

    let senses_warnings: { text: string; icon: React.ElementType; color: string, id: string }[] = [];
    const detectedSenses = new Set();
    let nearGhost = false;

    // Check for ghost in current room or adjacent rooms
     for (const connectedId of room.connections) {
        const connectedRoom = getRoomById(connectedId, gameMap);
        if (connectedRoom?.hasGhost) {
            nearGhost = true;
            break;
        }
    }
    if (room.hasGhost) nearGhost = true;
    
    if (nearGhost) {
        senses_warnings = [{ text: "Interferencias fantasma detectadas.", icon: Ghost, color: "text-purple-400", id: "ghost_interference" }];
    } else if (!inStatic) {
        for (const connectedId of room.connections) {
            const connectedRoom = getRoomById(connectedId, gameMap);
            if (connectedRoom) {
                if (connectedRoom.hasWumpus && !detectedSenses.has('wumpus')) { senses_warnings.push(senseTypes.wumpus); detectedSenses.add('wumpus'); }
                if (connectedRoom.hasPit && !detectedSenses.has('pit')) { senses_warnings.push(senseTypes.pit); detectedSenses.add('pit'); }
                if (connectedRoom.hasBat && !detectedSenses.has('bat')) { senses_warnings.push(senseTypes.bat); detectedSenses.add('bat'); }
                if (connectedRoom.hasStatic && !detectedSenses.has('static')) { senses_warnings.push(senseTypes.static); detectedSenses.add('static'); }
                if (connectedRoom.hasLockdown && !detectedSenses.has('lockdown')) { senses_warnings.push(senseTypes.lockdown); detectedSenses.add('lockdown'); }
                if (connectedRoom.hasGhost && !detectedSenses.has('ghost')) { senses_warnings.push(senseTypes.ghost); detectedSenses.add('ghost'); }
            }
        }
    }

    return { connectedRooms: connections, senses: senses_warnings, isInStatic: inStatic, isNearGhost: nearGhost };
  }, [playerRoomId, gameMap, getRoomById, lockdownEvent]);

  const getSensePositionClass = (senseId: string) => {
    switch (senseId) {
      case 'wumpus': return 'top-1 left-1';
      case 'pit': return 'top-1 right-1';
      case 'bat': return 'bottom-1 left-1';
      case 'static': return 'bottom-1 right-1';
      case 'lockdown': return 'top-1/2 left-1 -translate-y-1/2';
      case 'ghost': return 'top-1/2 right-1 -translate-y-1/2';
      default: return '';
    }
  }

  if (gameMap.length === 0) return <AnimatedLoading text={`Cargando Sector ${String(level).padStart(2, '0')}...`} />;

  const roomSizeClass = config.gridSize > 5 ? 'w-12 h-12 md:w-14 md:h-14' : 'w-16 h-16 md:w-16 md:h-16';
  const playerIconSizeClass = config.gridSize > 5 ? 'h-6 w-6 md:h-7 md:w-7' : 'h-8 w-8';

  return (
    <>
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex items-center justify-center p-4">
      <Button variant="ghost" size="icon" onClick={() => router.push('/games/wumpus/play/hunt')} className="absolute top-4 right-4 text-wumpus-accent hover:text-wumpus-primary hover:bg-wumpus-primary/10 z-10">
          <LogOut className="h-6 w-6" />
      </Button>
      
      <div className="flex flex-col items-center justify-center gap-4 w-full" style={{ maxWidth: `${config.gridSize * 5}rem` }}>
        <div className="w-full flex flex-col md:flex-row gap-4">
            <Card className="flex-1 bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
              <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-wumpus-primary"><UserCog />Estado del Extractor</CardTitle>
                  <CardDescription className="text-wumpus-foreground/60">Sector de Caza {String(level).padStart(2, '0')}</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-1 text-xs font-code min-h-[90px]">
                      {isInStatic ? (
                      <p className="text-orange-400 italic flex items-center gap-2"><WifiOff /> <Typewriter text="ERROR: Interferencia de sensor."/></p>
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

            <Card className="flex-1 bg-wumpus-card/80 backdrop-blur-sm border-wumpus-danger/20 text-wumpus-foreground">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-wumpus-danger"><Activity />Estado del Activo 734</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 text-xs font-code min-h-[20px]">
                    <div className={cn("flex items-center gap-2", wumpusStatus !== 'DORMIDO' ? 'text-wumpus-danger' : 'text-wumpus-foreground/70' )}>
                    <Typewriter text={`ESTADO: ${wumpusStatus}`} />
                    </div>
                </div>
            </CardContent>
            </Card>
        </div>

        <div className={`grid gap-1 bg-black/30 p-2 rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary`} style={{gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`}}>
            {gameMap.map(room => {
            const isPlayerInRoom = playerRoomId === room.id;
            const isConnected = connectedRooms.includes(room.id);
            const isVisited = visitedRooms.has(room.id);
            const isClickableForMove = isConnected && !isPlayerInRoom && !isShooting;
            const isClickableForShoot = isConnected && !isPlayerInRoom && isShooting;
            const isClickable = !gameOver && (isClickableForMove || isClickableForShoot);

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
                    'relative flex items-center justify-center border border-wumpus-accent/20 text-wumpus-accent',
                    roomSizeClass,
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
                     {isPlayerInRoom ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <UserCog className={playerIconSizeClass} />
                        <div className="absolute top-0 left-0 right-0 bottom-0">
                            {senses.map(sense => {
                                const SenseIcon = sense.icon;
                                return (
                                    <div key={sense.id} className={cn('absolute', getSensePositionClass(sense.id), sense.color)}>
                                        <SenseIcon className="h-3 w-3" />
                                    </div>
                                )
                            })}
                        </div>
                      </div>
                    ) : (
                        <>
                            {isVisited && !room.hasWumpus && !room.hasPit && !room.hasBat && !room.hasStatic && !room.hasLockdown && !room.hasGhost && (
                                <Footprints className={cn(playerIconSizeClass, 'text-wumpus-primary opacity-40')} />
                            )}
                        </>
                    )}
                </div>
                </div>
            );
            })}
        </div>
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
            <Button variant="outline" onClick={() => router.push('/games/wumpus/play/hunt')} className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
                <LogOut className="mr-2"/> Volver a Sectores
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
            <AlertDialogAction 
              onClick={() => {
                alertModal?.onConfirm();
                setAlertModal(null);
              }}
              className="w-full bg-wumpus-accent text-black hover:bg-wumpus-accent/80"
            >
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
