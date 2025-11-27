
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, Crosshair, LogOut, RotateCcw, Trophy, Server, Target, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Typewriter } from '@/components/typewriter';

type Room = {
  id: number;
  connections: number[];
  hasWumpus: boolean;
  hasPit: boolean;
  hasBat: boolean;
  isTerminal: boolean;
};

const generateFixedMap = (): Room[] => {
    const size = 4; // Changed to 4x4
    const roomCount = size * size;
    const rooms: Room[] = [];

    for (let i = 1; i <= roomCount; i++) {
        const connections: number[] = [];
        const row = Math.floor((i - 1) / size);
        const col = (i - 1) % size;

        if (col > 0) connections.push(i - 1);
        if (col < size - 1) connections.push(i + 1);
        if (row > 0) connections.push(i - size);
        if (row < size - 1) connections.push(i + size);

        rooms.push({ id: i, connections, hasWumpus: false, hasPit: false, hasBat: false, isTerminal: false });
    }
    
    // Fixed placement for narrative mission 1 (4x4)
    rooms.find(r => r.id === 12)!.hasWumpus = true;
    rooms.find(r => r.id === 7)!.hasPit = true;
    rooms.find(r => r.id === 3)!.hasBat = true;
    rooms.find(r => r.id === 15)!.isTerminal = true; // New terminal location

    return rooms;
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


export default function MissionOnePage() {
  const [gameMap, setGameMap] = useState<Room[]>([]);
  const [playerRoomId, setPlayerRoomId] = useState<number>(1);
  const [gameOver, setGameOver] = useState<GameOverReason>(null);
  const [alertModal, setAlertModal] = useState<AlertModalReason>(null);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set([1]));
  const router = useRouter();

  const getRoomById = useCallback((id: number, currentMap: Room[]) => currentMap.find(r => r.id === id), []);
  
  const checkHazardsAndEvents = useCallback((room: Room) => {
    if (room.hasWumpus) {
      setGameOver({
        icon: Skull, title: "Neutralizado por Activo Hostil",
        description: "El Activo 734 te ha encontrado. Misión fracasada.", variant: 'defeat',
      });
      return;
    }
    if (room.hasPit) {
      setGameOver({
        icon: AlertTriangle, title: "Peligro Estructural Fatal",
        description: "Has caído en un pozo de mantenimiento sin fondo. Misión fracasada.", variant: 'defeat',
      });
      return;
    }
    if (room.isTerminal) {
       setAlertModal({
          icon: Server, title: "Registro de Seguridad Recuperado",
          description: (
            <div className="text-left font-mono text-xs space-y-2 my-4">
                <div>&gt; <span className="text-wumpus-accent">ID DE REGISTRO:</span> 8492-GAMMA-9</div>
                <div>&gt; <span className="text-wumpus-accent">USUARIO:</span> C. VANCE, JEFE DE SEGURIDAD</div>
                <div>&gt; <span className="text-wumpus-accent">FECHA:</span> 24.10.2184</div>
                <div className="border-t border-wumpus-accent/20 pt-2">&gt; Brecha de contención confirmada. El Activo 734 está suelto en los túneles de mantenimiento. Repito, el Activo 734 está suelto.</div>
                <div>&gt; Las lecturas de bioseñales son... erráticas. Más agresivas que en las simulaciones.</div>
                <div>&gt; No tenemos contacto visual. Parece que está interfiriendo con nuestros sistemas. Los sensores de proximidad son nuestra única guía.</div>
                <div>&gt; Un Extractor ha sido desplegado. Esperemos que sea suficiente. Vance fuera.</div>
            </div>
          ),
          buttonText: "Continuar",
          onConfirm: () => {
             setGameOver({
                icon: Trophy, title: "Misión Cumplida",
                description: "Has recuperado el registro de datos. La información obtenida es vital para las siguientes operaciones.", variant: 'victory',
             });
          },
       });
       return;
    }
    if (room.hasBat) {
       let newRoomId;
        do {
            newRoomId = Math.floor(Math.random() * gameMap.length) + 1;
        } while (newRoomId === playerRoomId);

        const newRoom = getRoomById(newRoomId, gameMap)!;
        setPlayerRoomId(newRoomId);
        setVisitedRooms(prev => new Set(prev).add(newRoomId));
        // Check hazards in the new room after a brief delay
        setTimeout(() => checkHazardsAndEvents(newRoom), 100);
    }
  }, [gameMap.length, playerRoomId, getRoomById]);

  const handleMove = useCallback((newRoomId: number) => {
    if (gameOver) return;
    const newRoom = getRoomById(newRoomId, gameMap);
    if (!newRoom) return;
    setVisitedRooms(prev => new Set(prev).add(newRoomId));
    setPlayerRoomId(newRoom.id);
    checkHazardsAndEvents(newRoom);
  }, [gameOver, getRoomById, gameMap, checkHazardsAndEvents]);

  const restartGame = useCallback(() => {
    setGameMap(generateFixedMap());
    setPlayerRoomId(1);
    setGameOver(null);
    setVisitedRooms(new Set([1]));
    setAlertModal(null);
  }, []);
  
  useEffect(() => {
    restartGame();
  }, [restartGame]);

  const { connectedRooms, senses } = useMemo(() => {
    if (gameMap.length === 0) return { connectedRooms: [], senses: [] };
    const room = getRoomById(playerRoomId, gameMap);
    if (!room) return { connectedRooms: [], senses: [] };
    
    const senseTypes = {
        wumpus: { text: 'Alerta: Interferencia biológica.', icon: Skull, color: 'text-wumpus-danger', id: 'wumpus' },
        pit: { text: 'Peligro: Pozo estructural.', icon: AlertTriangle, color: 'text-wumpus-warning', id: 'pit' },
        bat: { text: 'Anomalía: Dron de transporte.', icon: Shuffle, color: 'text-wumpus-accent', id: 'bat' }
    };

    const senses_warnings: { text: string; icon: React.ElementType; color: string, id: string }[] = [];
    const detectedSenses = new Set();

    for (const connectedId of room.connections) {
        const connectedRoom = getRoomById(connectedId, gameMap);
        if (connectedRoom) {
            if (connectedRoom.hasWumpus && !detectedSenses.has('wumpus')) { senses_warnings.push(senseTypes.wumpus); detectedSenses.add('wumpus'); }
            if (connectedRoom.hasPit && !detectedSenses.has('pit')) { senses_warnings.push(senseTypes.pit); detectedSenses.add('pit'); }
            if (connectedRoom.hasBat && !detectedSenses.has('bat')) { senses_warnings.push(senseTypes.bat); detectedSenses.add('bat'); }
        }
    }
    return { connectedRooms: room.connections, senses: senses_warnings };
  }, [playerRoomId, gameMap, getRoomById]);

  const getSensePositionClass = (senseId: string) => {
    switch (senseId) {
      case 'wumpus': return 'absolute top-1 left-1';
      case 'pit': return 'absolute top-1 right-1';
      case 'bat': return 'absolute bottom-1 left-1';
      default: return 'absolute';
    }
  }

  if (gameMap.length === 0) return null;

  return (
    <>
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
        <Card className="w-full bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
          <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-wumpus-primary"><Target />Objetivo de la Misión</CardTitle>
              <CardDescription className="text-wumpus-foreground/60">Misión 01: El Incidente Gamma-9</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="font-code text-sm text-wumpus-accent">Alcanza el terminal de datos en la habitación 15.</p>
              <div className="mt-4 space-y-1 text-xs font-code min-h-[60px]">
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-1 bg-black/30 p-2 rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary">
            {gameMap.map(room => {
            const isPlayerInRoom = playerRoomId === room.id;
            const isConnected = connectedRooms.includes(room.id);
            const isVisited = visitedRooms.has(room.id);
            const isClickable = !gameOver && isConnected && !isPlayerInRoom;
            
            return (
                <div
                  key={room.id}
                  onClick={() => isClickable && handleMove(room.id)}
                  role="button"
                  tabIndex={isClickable ? 0 : -1}
                  className={cn(
                      'relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 border border-wumpus-accent/20 text-wumpus-accent font-bold',
                      'transition-all duration-200',
                      isPlayerInRoom && 'bg-wumpus-primary/20 ring-2 ring-wumpus-primary text-wumpus-primary',
                      isClickable && 'bg-wumpus-accent/10 hover:bg-wumpus-accent/20 hover:border-wumpus-accent cursor-pointer',
                      !isClickable && !isPlayerInRoom && 'bg-wumpus-background/50',
                      gameOver && 'cursor-not-allowed'
                  )}
                >
                  {isPlayerInRoom ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <UserCog className="h-8 w-8" />
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
                  ) : (
                    <>
                      {isVisited && !room.isTerminal && <Footprints className="h-8 w-8 text-wumpus-primary opacity-40" />}
                      {room.isTerminal && <Server className="h-8 w-8 text-wumpus-primary" />}
                    </>
                  )}
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
            <Button variant="outline" onClick={() => router.push('/games/wumpus/play')} className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
                <LogOut className="mr-2"/> Volver a Misiones
            </Button>
            {gameOver?.variant === 'defeat' && (
                <Button onClick={restartGame} className="bg-wumpus-primary text-wmpus-primary-foreground hover:bg-wumpus-primary/90">
                    <RotateCcw className="mr-2"/> Reiniciar Misión
                </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!alertModal} onOpenChange={(open) => !open && setAlertModal(null)}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-wumpus-accent">
          <AlertDialogHeader>
            {alertModal?.icon && <alertModal.icon className="h-12 w-12 mx-auto text-wumpus-accent" />}
            <AlertDialogTitle className="text-center text-2xl text-wumpus-accent">{alertModal?.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-center text-wumpus-foreground/80 max-h-[50vh] overflow-y-auto px-2">
            {alertModal?.description}
          </div>
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
    </>
  );
}
