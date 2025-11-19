
'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { GAMES } from '@/games';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GamePage() {
  const params = useParams();
  const { gameId } = params;

  const game = GAMES.find((g) => g.id === gameId);

  if (!game) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error: Juego no Encontrado</AlertTitle>
                <AlertDescription>
                    No se pudo encontrar el juego con el ID &quot;{gameId}&quot;. 
                    Por favor, comprueba la URL o vuelve al panel.
                </AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="mt-4">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Panel
                </Link>
            </Button>
        </div>
    );
  }

  const GameComponent = game.component;

  return (
      <GameComponent />
  );
}
