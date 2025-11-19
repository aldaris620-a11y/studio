
'use client';

import { useParams } from 'next/navigation';
import { GAMES } from '@/games';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

export default function AchievementsPage() {
  const params = useParams();
  const { gameId } = params;

  const game = GAMES.find((g) => g.id === gameId);

  if (!game) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center h-full text-center p-4">
          <Card className="w-full max-w-md">
              <CardHeader>
                  <CardTitle>Juego no Encontrado</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>No se pudo encontrar el juego. Por favor, vuelve al panel.</p>
                  <Button asChild className="mt-4">
                      <Link href="/dashboard">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Volver al Panel
                      </Link>
                  </Button>
              </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  const GameIcon = game.icon;

  return (
    <AuthGuard>
        <div className="container mx-auto p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-amber-400" />
                    Logros: {game.name}
                </h1>
                <Button asChild variant="outline">
                    <Link href={`/games/${game.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Juego
                    </Link>
                </Button>
            </div>
            
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GameIcon className="h-6 w-6" />
                Tus Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                ¡La sección de logros está en construcción! Vuelve pronto para ver tus hazañas.
              </p>
               <Button asChild variant="link" className="px-0">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Panel
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
    </AuthGuard>
  );
}
