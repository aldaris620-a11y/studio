
'use client';
import { getGames, getRewards } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Gamepad2, Lock, Trophy, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Game, Reward } from '@/lib/data';


export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    // TODO: This should come from firestore
    getGames().then(setGames);
    getRewards().then(setRewards);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tu Panel</h1>
        <p className="text-muted-foreground">Sigue tu progreso y desbloquea recompensas increíbles.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Gamepad2 className="text-primary"/>
            Tus Juegos
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
              <CardHeader className="p-0">
                <Image 
                    src={game.imageUrl} 
                    alt={game.name} 
                    width={600} height={400} 
                    className="w-full h-48 object-cover" 
                    data-ai-hint={game.imageHint}
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-1">{game.name}</CardTitle>
                <CardDescription className="mb-4">{game.description}</CardDescription>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">{game.progress}%</span>
                    <Progress value={game.progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Trophy className="text-accent" />
            Recompensas Entre Juegos
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
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
          ))}
        </div>
      </section>
    </div>
  );
}
