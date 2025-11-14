
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skull } from 'lucide-react';
import { WumpusGame, GameState } from '@/lib/wumpus-game';
import { AnimatedLoading } from '@/components/animated-loading';

export default function WumpusPage() {
  const [game, setGame] = useState<WumpusGame | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const newGame = new WumpusGame();
    setGame(newGame);
    setGameState(newGame.getState());
  }, []);

  const handleMove = (room: number) => {
    if (game) {
      game.move(room);
      setGameState(game.getState());
    }
  };

  const handleShoot = (room: number) => {
    if (game) {
      game.shoot(room);
      setGameState(game.getState());
    }
  }

  const handleNewGame = () => {
    if (game) {
      game.newGame();
      setGameState(game.getState());
    }
  };

  if (!game || !gameState) {
    return <AnimatedLoading />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skull className="h-6 w-6" />
              <span>Caza del Wumpus</span>
            </div>
            <Button onClick={handleNewGame} variant="outline">Nuevo Juego</Button>
          </CardTitle>
          <CardDescription>
            {gameState.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="font-semibold text-lg">Estado del Juego (para depuración)</h3>
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 text-slate-50 text-sm overflow-x-auto">
              {JSON.stringify(gameState, null, 2)}
            </pre>
          </div>

          <div className="space-y-4">
             <h3 className="font-semibold text-lg">Acciones</h3>
             <div className="flex flex-wrap gap-2">
                {gameState.adjacentRooms.map((room) => (
                    <Button key={`move-${room}`} onClick={() => handleMove(room)} disabled={gameState.gameOver}>
                        Moverse a {room}
                    </Button>
                ))}
             </div>
             <div className="flex flex-wrap gap-2">
                {gameState.adjacentRooms.map((room) => (
                    <Button key={`shoot-${room}`} onClick={() => handleShoot(room)} variant="destructive"  disabled={gameState.gameOver || gameState.arrows === 0}>
                        Disparar a {room}
                    </Button>
                ))}
             </div>
          </div>
        
        </CardContent>
      </Card>
    </div>
  );
}
