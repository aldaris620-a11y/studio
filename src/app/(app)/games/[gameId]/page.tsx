
'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { GAMES } from '@/games';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function GamePage() {
  const params = useParams();
  const { gameId } = params;

  const game = GAMES.find((g) => g.id === gameId);

  if (!game) {
    return (
        <div className="flex items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error: Juego no Encontrado</AlertTitle>
                <AlertDescription>
                    No se pudo encontrar el juego con el ID &quot;{gameId}&quot;. 
                    Por favor, comprueba la URL o vuelve al panel.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  const GameComponent = game.component;

  return (
      <GameComponent />
  );
}
