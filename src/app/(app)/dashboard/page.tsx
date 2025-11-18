
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Lock, Trophy, Unlock, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GAMES, GameDefinition, getRewards, Reward } from '@/games';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoadingRewards, setIsLoadingRewards] = useState(true);

  useEffect(() => {
    // TODO: This should come from firestore
    setIsLoadingRewards(true);
    getRewards().then(rewards => {
        setRewards(rewards);
        setIsLoadingRewards(false);
    });
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Centro de Mando</h1>
        <p className="text-muted-foreground">Monitoriza tus sistemas, progreso y recompensas activas.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Gamepad2 className="text-primary"/>
            Tus Juegos
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {GAMES.map((game: GameDefinition) => {
            const Icon = game.icon;
            const gameUrl = `/games/${game.id}`;
            const achievementsUrl = `${gameUrl}/achievements`;
            // TODO: Progress should come from firestore
            const progress = 0; 
            
            return (
              <Card key={game.id} className="flex items-center p-4 transition-shadow hover:shadow-md">
                <div className="flex-shrink-0">
                  <Icon className="h-10 w-10 text-primary mr-4" />
                </div>
                <div className="flex-grow">
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <CardDescription className="text-xs mb-2">{game.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-full h-2" />
                    <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
                  </div>
                </div>
                <div className="flex items-center ml-4 flex-shrink-0">
                    <Link href={achievementsUrl} passHref>
                        <Button variant="ghost" size="icon" aria-label="Logros">
                            <Trophy className="h-6 w-6"/>
                        </Button>
                    </Link>
                    <Link href={gameUrl} passHref>
                        <Button variant="ghost" size="icon" aria-label="Jugar">
                            <PlayCircle className="h-6 w-6"/>
                        </Button>
                    </Link>
                </div>
              </Card>
            );
        })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Trophy className="text-accent" />
            Recompensas Entre Juegos
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingRewards ? (
            [...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            ))
          ) : (
            rewards.map((reward) => (
                <Card key={reward.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{reward.name}</CardTitle>
                        {reward.unlocked ? (
                             <Badge variant="default" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                                <Unlock className="mr-1 h-4 w-4"/> Desbloqueado
                            </Badge>
                        ) : (
                            <Badge variant="secondary">
                                <Lock className="mr-1 h-4 w-4"/> Bloqueado
                            </Badge>
                        )}
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground italic">
                      Cómo desbloquear: {reward.gameToUnlock}
                    </p>
                  </CardContent>
                </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
