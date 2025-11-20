
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Skull, AlertTriangle, Shuffle, WifiOff, ShieldAlert, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';

// Centralized Level Configuration
const levelConfigs = [
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

const huntLevels = levelConfigs.map(config => ({
  id: `sector-${String(config.level).padStart(2, '0')}`,
  level: config.level,
  title: `Sector de Caza ${String(config.level).padStart(2, '0')}`,
  description: config.level < 3 ? 'Baja actividad anómala detectada.' : config.level < 7 ? 'Múltiples peligros estructurales.' : 'Alerta: Entorno altamente hostil.',
  difficulty: config.level,
  enabled: true,
  hazards: {
    wumpus: config.wumpusCount,
    pit: config.pitCount,
    bat: config.batCount,
    static: config.staticCount,
    lockdown: config.lockdownCount,
    ghost: config.ghostCount,
  }
}));

const hazardIcons = {
    wumpus: { icon: Skull, color: 'text-wumpus-danger' },
    pit: { icon: AlertTriangle, color: 'text-wumpus-warning' },
    bat: { icon: Shuffle, color: 'text-wumpus-accent' },
    static: { icon: WifiOff, color: 'text-gray-400' },
    lockdown: { icon: ShieldAlert, color: 'text-orange-400' },
    ghost: { icon: Ghost, color: 'text-purple-400' },
};


export default function HuntSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLevelSelect = (levelNumber: number) => {
    const levelId = `sector-${String(levelNumber).padStart(2, '0')}`;
    setIsLoading(levelId);
    router.push(`/games/wumpus/play/hunt/${levelNumber}`);
  };

  if (isLoading) {
    return <AnimatedLoading text={`Accediendo al ${isLoading.replace('-', ' ')}...`} />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-wumpus-primary uppercase animate-pulse mb-2">
          CONTRATOS DE CACERÍA
        </h1>
        <p className="text-wumpus-foreground/70 mb-8 text-md">
          Selecciona un sector para iniciar la neutralización del Activo 734.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {huntLevels.map((level, index) => (
            <div
              key={level.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-lg border border-wumpus-accent/20 bg-wumpus-card/80 p-4 text-left transition-all duration-300 ease-in-out fade-in",
                level.enabled ? "cursor-pointer hover:border-wumpus-primary hover:shadow-glow-wumpus-primary hover:-translate-y-1" : "opacity-50 cursor-not-allowed",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => level.enabled && handleLevelSelect(level.level)}
            >
              <h2 className="text-lg font-bold text-wumpus-primary">{level.title}</h2>
              <div className="flex items-center mt-2">
                <div className="flex gap-1 w-full">
                  {[...Array(level.difficulty)].map((_, i) => (
                    <Skull key={i} className="h-3 w-3 text-wumpus-danger" />
                  ))}
                   {[...Array(10 - level.difficulty)].map((_, i) => (
                    <Skull key={i} className="h-3 w-3 text-wumpus-danger/20" />
                  ))}
                </div>
              </div>
              <div className="mt-3 border-t border-wumpus-accent/10 pt-3">
                 <p className="text-xs font-semibold mb-2 text-wumpus-accent">Informe de Peligros:</p>
                 <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    {Object.entries(level.hazards).map(([key, count]) => {
                        if (count > 0) {
                            const IconComponent = hazardIcons[key as keyof typeof hazardIcons].icon;
                            const colorClass = hazardIcons[key as keyof typeof hazardIcons].color;
                            return (
                                <div key={key} className={cn("flex items-center gap-1.5", colorClass)}>
                                    <IconComponent className="h-3 w-3" />
                                    <span>x{count}</span>
                                </div>
                            );
                        }
                        return null;
                    })}
                 </div>
              </div>

               {!level.enabled && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="font-bold text-wumpus-danger">BLOQUEADO</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="ghost" onClick={() => router.back()} className="mt-12 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Tablero de Misiones
      </Button>
    </main>
  );
}
