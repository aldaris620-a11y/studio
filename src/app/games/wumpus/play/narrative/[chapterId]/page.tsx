'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Skull, AlertTriangle, Shuffle, WifiOff, ShieldAlert, Ghost, Lock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';
import { chapters, Mission } from '@/games/wumpus/narrative-missions';

const hazardIcons = {
    wumpus: { icon: Skull, color: 'text-wumpus-danger' },
    pit: { icon: AlertTriangle, color: 'text-wumpus-warning' },
    bat: { icon: Shuffle, color: 'text-wumpus-accent' },
    static: { icon: WifiOff, color: 'text-gray-400' },
    lockdown: { icon: ShieldAlert, color: 'text-orange-400' },
    ghost: { icon: Ghost, color: 'text-purple-400' },
};


export default function MissionSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const { chapterId } = params;

  const chapter = chapters.find(c => c.id === chapterId);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleMissionSelect = (mission: Mission) => {
    if (!mission.enabled) return;
    setIsLoading(mission.id);
    router.push(`/games/wumpus/play/narrative/${chapterId}/${mission.id}`);
  };

  if (!chapter) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
             <h1 className="text-2xl text-wumpus-danger">Error: Capítulo no encontrado.</h1>
             <Button variant="ghost" onClick={() => router.push('/games/wumpus/play/narrative')} className="mt-8 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la Selección de Capítulos
            </Button>
        </div>
    );
  }
  
  if (isLoading) {
    const mission = chapter.missions.find(m => m.id === isLoading);
    return <AnimatedLoading text={`Accediendo a ${mission?.title}...`} />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-wumpus-primary uppercase animate-pulse mb-2">
          {chapter.title}
        </h1>
        <p className="text-wumpus-foreground/70 mb-8 text-md">
          {chapter.subtitle}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {chapter.missions.map((mission, index) => (
            <div
              key={mission.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-lg border border-wumpus-accent/20 bg-wumpus-card/80 p-4 text-left transition-all duration-300 ease-in-out fade-in",
                mission.enabled ? "cursor-pointer hover:border-wumpus-primary hover:shadow-glow-wumpus-primary hover:-translate-y-1" : "opacity-50 cursor-not-allowed",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleMissionSelect(mission)}
            >
              <h2 className="text-lg font-bold text-wumpus-primary">{mission.title}</h2>
              <div className="mt-2 border-t border-wumpus-accent/10 pt-2">
                 <p className="text-xs font-semibold mb-2 text-wumpus-accent flex items-center gap-2"><Target/> Objetivo de la Misión:</p>
                 <p className="text-xs text-wumpus-foreground/80">{mission.objective}</p>
              </div>

               {!mission.enabled && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <Lock className="h-8 w-8 mb-2 text-wumpus-danger"/>
                    <span className="font-bold text-wumpus-danger">BLOQUEADO</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="ghost" onClick={() => router.push('/games/wumpus/play/narrative')} className="mt-12 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la Selección de Capítulos
      </Button>
    </main>
  );
}
