'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, Crosshair, LogOut, RotateCcw, Trophy, WifiOff, ShieldAlert, Footprints, Ghost, Activity, Target, Server, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Typewriter } from '@/components/typewriter';
import { AnimatedLoading } from '@/components/animated-loading';
import { chapters, Mission } from '@/games/wumpus/narrative-missions';
import { LevelConfig, levelConfigs } from '@/games/wumpus/level-configs';


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
  isTerminal: boolean; // For narrative missions
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
    description: React.ReactNode;
    buttonText: string;
    onConfirm: () => void;
} | null;

type PendingAction = 'transportByDrone' | 'moveWumpus' | null;
type WumpusStatus = 'DORMIDO' | 'EN MOVIMIENTO' | 'REUBICADO POR DRON';

// Dynamic Map Generation
const generateMap = (config: LevelConfig, terminalRoom?: number): Room[] => {
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

        rooms.push({ id: i, connections, hasWumpus: false, hasPit: false, hasBat: false, hasStatic: false, hasLockdown: false, hasGhost: false, isTerminal: false });
    }

    // 2. Place hazards
    const playerStartRoom = 1;
    let availableRooms = rooms.map(r => r.id).filter(id => id !== playerStartRoom && id !== terminalRoom);
    
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

    if (terminalRoom) {
      const termRoom = rooms.find(r => r.id === terminalRoom);
      if (termRoom) termRoom.isTerminal = true;
    }

    return rooms;
}

export default function NarrativeMissionPage() {
  const router = useRouter();
  const params = useParams();
  const { chapterId, missionId } = params;

  const { chapter, mission, nextMission } = useMemo(() => {
    const currentChapter = chapters.find(c => c.id === chapterId);
    if (!currentChapter) return { chapter: null, mission: null, nextMission: null };
    
    const missionIndex = currentChapter.missions.findIndex(m => m.id === missionId);
    const currentMission = currentChapter.missions[missionIndex];
    const nextMission = missionIndex + 1 < currentChapter.missions.length ? currentChapter.missions[missionIndex + 1] : null;
    
    return { chapter: currentChapter, mission: currentMission, nextMission };
  }, [chapterId, missionId]);

  const config = useMemo(() => {
      if (!mission) return levelConfigs[0];
      return levelConfigs.find(c => c.level === mission.level) || levelConfigs[0]
  }, [mission]);

  const [gameMap, setGameMap] = useState<Room[]>([]);
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<GameOverReason>(null);
  const [alertModal, setAlertModal] = useState<AlertModalReason>(null);
  const [lockdownEvent, setLockdownEvent] = useState<boolean>(false);
  const [lockdownContinue, setLockdownContinue] = useState<boolean>(false);
  const [arrowsLeft, setArrowsLeft] = useState<number>(config.arrows);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set([1]));
  const [discoveredHazards, setDiscoveredHazards] = useState<Set<number>>(new Set());
  const [wumpusStatus, setWumpusStatus] = useState<WumpusStatus>('DORMIDO');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const getRoomById = useCallback((id: number, currentMap: Room[]) => currentMap.find(r => r.id === id), []);

  const handleMissionComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
        const completed = JSON.parse(localStorage.getItem('completedMissions') || '{}');
        completed[missionId] = true;
        localStorage.setItem('completedMissions', JSON.stringify(completed));
    }
     setGameOver({ icon: Trophy, title: "Misión Cumplida", description: "Has recuperado el registro de datos. La información obtenida es vital para las siguientes operaciones.", variant: 'victory' });
  }, [missionId]);

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
            setGameOver({ icon: Trophy, title: "Activo Neutralizado por el Entorno", description: "¡Has tenido suerte! El Activo 734 se movió y cayó en un pozo sin fondo.", variant: 'victory' });
            return tempMap.map(r => ({ ...r, hasWumpus: false }));
        }
        if (newWumpusRoom.id === playerRoomId) {
            setGameOver({ icon: Skull, title: "¡Te ha encontrado!", description: "El Activo 734 se ha movido a tu ubicación. Misión fracasada.", variant: 'defeat' });
            return tempMap;
        }
        if (newWumpusRoom.hasBat) {
            setWumpusStatus('REUBICADO POR DRON');
            let finalRoomId;
            do {
                finalRoomId = Math.floor(Math.random() * tempMap.length) + 1;
            } while (finalRoomId === newWumpusRoomId || finalRoomId === playerRoomId);

            if (finalRoomId === playerRoomId) {
                setGameOver({ icon: Skull, title: "Entrega Mortal", description: "Un dron transportó al Activo 734 directamente a tu ubicación. Misión fracasada.", variant: 'defeat' });
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
      setGameOver({ icon: Skull, title: "Neutralizado por Activo Hostil", description: "El Activo 734 te ha encontrado. Misión fracasada.", variant: 'defeat' });
      return true;
    }
    if (room.hasPit) {
      setGameOver({ icon: AlertTriangle, title: "Peligro Estructural Fatal", description: "Has caído en un pozo de mantenimiento sin fondo. Misión fracasada.", variant: 'defeat' });
      return true;
    }
     if (mission?.dataLog && room.isTerminal) {
       setAlertModal({
          icon: Server, title: mission.dataLog.title,
          description: (
            <div className="text-left font-mono text-xs space-y-2 my-4 max-h-[40vh] overflow-y-auto pr-2">
                {mission.dataLog.content.map((line, index) => (
                    <div key={index}>{line.startsWith('>') ? <span>&gt; </span> : ''}<span className={line.startsWith('>') ? 'text-wumpus-accent' : ''}>{line.replace('>','')}</span></div>
                ))}
            </div>
          ),
          buttonText: "Continuar Misión",
          onConfirm: handleMissionComplete,
       });
       return true;
    }
    if (room.hasBat) {
      setDiscoveredHazards(prev => new Set(prev).add(room.id));
      setAlertModal({ icon: Shuffle, title: "Dron de Transporte Activado", description: "Un dron de transporte errático te ha atrapado. ¡Prepárate para una reubicación forzada!", buttonText: "Continuar", onConfirm: () => setPendingAction('transportByDrone') });
      return false;
    }
    if (room.hasLockdown) {
      setDiscoveredHazards(prev => new Set(prev).add(room.id));
      setLockdownEvent(true);
      setLockdownContinue(false);
      setTimeout(() => setLockdownContinue(true), 2000);
      return false;
    }
    if (room.hasGhost) setDiscoveredHazards(prev => new Set(prev).add(room.id));
    if (room.hasStatic) setDiscoveredHazards(prev => new Set(prev).add(room.id));
    return false;
  }, [mission, handleMissionComplete]);

  const handleDroneTransport = useCallback(() => {
    setGameMap(currentMap => {
        let randomRoomId, newRoom;
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

    if (isGameStarted && Math.random() < config.wumpusMoveChance) {
        setPendingAction('moveWumpus');
    }
    checkHazards(newRoom);
  }, [gameOver, gameMap, getRoomById, checkHazards, isGameStarted, config.wumpusMoveChance]);

  const restartGame = useCallback(() => {
    if (!mission) return;
    const newMap = generateMap(config, mission.terminalRoom);
    setGameMap(newMap);
    setPlayerRoomId(1);
    setGameOver(null);
    setArrowsLeft(config.arrows);
    setLockdownEvent(false);
    setWumpusStatus('DORMIDO');
    setVisitedRooms(new Set([1]));
    setDiscoveredHazards(new Set());
    setAlertModal(null);
    setIsGameStarted(false);
    setPendingAction(null);
  }, [config, mission]);

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
        terminal: { text: 'Señal de datos cercana.', icon: Server, color: 'text-wumpus-primary', id: 'terminal' },
    };

    let senses_warnings: { text: string; icon: React.ElementType; color: string, id: string }[] = [];
    const detectedSenses = new Set();
    let nearGhost = false;

     for (const connectedId of room.connections) {
        const connectedRoom = getRoomById(connectedId, gameMap);
        if (connectedRoom?.hasGhost) {
            nearGhost = true; break;
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
                if (connectedRoom.isTerminal && !detectedSenses.has('terminal')) { senses_warnings.push(senseTypes.terminal); detectedSenses.add('terminal'); }
            }
        }
    }

    return { connectedRooms: connections, senses: senses_warnings, isInStatic: inStatic, isNearGhost: nearGhost };
  }, [playerRoomId, gameMap, getRoomById, lockdownEvent]);

  const getSensePositionClass = (senseId: string) => {
    switch (senseId) {
      case 'wumpus': return 'absolute top-1 left-1';
      case 'pit': return 'absolute top-1 right-1';
      case 'bat': return 'absolute bottom-1 left-1';
      case 'static': return 'absolute bottom-1 right-1';
      case 'lockdown': return 'absolute top-1/2 left-1 -translate-y-1/2';
      case 'ghost': return 'absolute top-1/2 right-1 -translate-y-1/2';
      case 'terminal': return 'absolute bottom-1 right-1';
      default: return 'absolute';
    }
  }
  
  const handleNextMission = () => {
    if (nextMission) {
      router.push(`/games/wumpus/play/narrative/${chapterId}/${nextMission.id}`);
    } else {
      router.push(`/games/wumpus/play/narrative`); // Go back to chapter select if no more missions
    }
  };


  if (!mission) return <AnimatedLoading text={`Cargando Misión...`} />;

  const roomSizeClass = config.gridSize > 5 ? 'w-12 h-12 md:w-14 md:h-14' : 'w-16 h-16 md:w-16 md:h-16';
  const playerIconSizeClass = config.gridSize > 5 ? 'h-6 w-6 md:h-7 md:w-7' : 'h-8 w-8';

  return (
    <>
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex items-center justify-center p-4">
      <Button variant="ghost" size="icon" onClick={() => router.push(`/games/wumpus/play/narrative/${chapterId}`)} className="absolute top-4 right-4 text-wumpus-accent hover:text-wumpus-primary hover:bg-wumpus-primary/10 z-10">
          <LogOut className="h-6 w-6" />
      </Button>
      
      <div className="flex flex-col items-center justify-center gap-4 w-full" style={{ maxWidth: `${config.gridSize * 5}rem` }}>
        <div className="w-full flex flex-col md:flex-row gap-4">
            <Card className="flex-1 bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
              <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-wumpus-primary"><Target />Objetivo de la Misión</CardTitle>
                  <CardDescription className="text-wumpus-foreground/60">{mission.title}</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="font-code text-sm text-wumpus-accent">{mission.objective}</p>
                  <div className="mt-4 space-y-1 text-xs font-code min-h-[90px]">
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
              </CardContent>
            </Card>

        </div>

        <div className={`grid gap-1 bg-black/30 p-2 rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary`} style={{gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`}}>
            {gameMap.map(room => {
            const isPlayerInRoom = playerRoomId === room.id;
            const isConnected = connectedRooms.includes(room.id);
            const isVisited = visitedRooms.has(room.id);
            const isClickable = !gameOver && isConnected && !isPlayerInRoom;

            return (
                <div
                key={room.id}
                onClick={() => isClickable && handleMove(room.id) }
                role="button"
                tabIndex={isClickable ? 0 : -1}
                className={cn(
                    'relative flex items-center justify-center border border-wumpus-accent/20 text-wumpus-accent',
                    roomSizeClass,
                    'transition-all duration-200',
                    isPlayerInRoom && 'bg-wumpus-primary/20 ring-2 ring-wumpus-primary text-wumpus-primary',
                    isClickable && 'bg-wumpus-accent/10 hover:bg-wumpus-accent/20 hover:border-wumpus-accent cursor-pointer',
                    !isClickable && !isPlayerInRoom && 'bg-wumpus-background/50',
                    gameOver && 'cursor-not-allowed',
                )}
                >
                  {isPlayerInRoom ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <UserCog className={playerIconSizeClass} />
                        <div className="absolute top-0 left-0 right-0 bottom-0">
                            {senses.map(sense => {
                                const SenseIcon = sense.icon;
                                return (
                                    <div key={sense.id} className={cn(getSensePositionClass(sense.id), sense.color)}>
                                        <SenseIcon className="h-3 w-3" />
                                    </div>
                                )
                            })}
                        </div>
                      </div>
                    ) : room.isTerminal ? (
                       <Server className={cn(playerIconSizeClass, 'text-wumpus-primary')} />
                    ) : isVisited ? (
                        <Footprints className={cn(playerIconSizeClass, 'text-wumpus-primary opacity-40')} />
                    ) : null}
                </div>
            );
            })}
        </div>
      </div>
    </div>
    
      <AlertDialog open={!!gameOver}>
        <AlertDialogContent className={cn( "bg-wumpus-card text-wumpus-foreground border-wumpus-primary", gameOver?.variant === 'defeat' && "border-wumpus-danger shadow-glow-wumpus-danger", gameOver?.variant === 'victory' && "border-green-500 shadow-glow-wumpus-primary" )}>
          <AlertDialogHeader>
            {gameOver?.icon && <gameOver.icon className={cn("h-12 w-12 mx-auto", { 'text-wumpus-danger': gameOver?.variant === 'defeat', 'text-green-500': gameOver?.variant === 'victory' })} />}
            <AlertDialogTitle className={cn("text-center text-2xl", { 'text-wumpus-danger': gameOver?.variant === 'defeat', 'text-green-500': gameOver?.variant === 'victory' })}>{gameOver?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-wumpus-foreground/80"> {gameOver?.description} </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {gameOver?.variant === 'victory' ? (
                <>
                    <Button variant="outline" onClick={() => router.push(`/games/wumpus/play/narrative/${chapterId}`)} className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
                        <LogOut className="mr-2"/> Volver a Misiones
                    </Button>
                    <Button onClick={handleNextMission} className="bg-wumpus-primary text-wumpus-primary-foreground hover:bg-wumpus-primary/90">
                       <RotateCcw className="mr-2"/> {nextMission ? 'Siguiente Misión' : 'Fin del Capítulo'}
                    </Button>
                </>
            ): (
                 <>
                    <Button variant="outline" onClick={() => router.push(`/games/wumpus/play/narrative/${chapterId}`)} className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
                        <LogOut className="mr-2"/> Abandonar Misión
                    </Button>
                     <Button onClick={restartGame} className="bg-wumpus-primary text-wumpus-primary-foreground hover:bg-wumpus-primary/90">
                        <RotateCcw className="mr-2"/> Reiniciar Misión
                    </Button>
                 </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <AlertDialog open={!!alertModal}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-wumpus-accent">
          <AlertDialogHeader>
            {alertModal?.icon && <alertModal.icon className="h-12 w-12 mx-auto text-wumpus-accent" />}
            <AlertDialogTitle className="text-center text-2xl text-wumpus-accent">{alertModal?.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-wumpus-foreground/80">{alertModal?.description}</div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { alertModal?.onConfirm(); setAlertModal(null); }} className="w-full bg-wumpus-accent text-black hover:bg-wumpus-accent/80">
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
            <AlertDialogDescription className="text-center text-wumpus-foreground/80"> Has activado una trampa de contención. Las rutas de salida están selladas temporalmente. Espera... </AlertDialogDescription>
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
