'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedLoading } from '@/components/animated-loading';
import { chapters } from '@/games/wumpus/narrative-missions';

export default function NarrativeChapterSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleChapterSelect = (chapterId: string, enabled: boolean) => {
    if (!enabled) return;
    setIsLoading(chapterId);
    router.push(`/games/wumpus/play/narrative/${chapterId}`);
  };

  if (isLoading) {
    const chapter = chapters.find(c => c.id === isLoading);
    return <AnimatedLoading text={`Cargando ${chapter?.title}...`} />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-wumpus-primary uppercase animate-pulse mb-2">
          INVESTIGACIÓN NARRATIVA
        </h1>
        <p className="text-wumpus-foreground/70 mb-8 text-md">
          Selecciona un capítulo para continuar la investigación.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-lg border border-wumpus-accent/20 bg-wumpus-card/80 p-6 text-left transition-all duration-300 ease-in-out fade-in",
                chapter.enabled ? "cursor-pointer hover:border-wumpus-primary hover:shadow-glow-wumpus-primary hover:-translate-y-1" : "opacity-50 cursor-not-allowed",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleChapterSelect(chapter.id, chapter.enabled)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-wumpus-primary">{chapter.title}</h2>
                  <p className="text-sm text-wumpus-foreground/60">{chapter.subtitle}</p>
                </div>
                <BookOpen className="h-8 w-8 text-wumpus-accent/50 group-hover:text-wumpus-accent transition-colors"/>
              </div>
              <p className="mt-4 text-sm text-wumpus-foreground/80 flex-grow">
                {chapter.description}
              </p>
              {!chapter.enabled && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center font-bold text-wumpus-danger">
                  <Lock className="h-8 w-8 mb-2"/>
                  <span>BLOQUEADO</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="ghost" onClick={() => router.push('/games/wumpus/play')} className="mt-12 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Tablero de Misiones
      </Button>
    </main>
  );
}
