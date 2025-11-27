'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, BookOpen, Server, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { AnimatedLoading } from '@/components/animated-loading';
import { chapters, Mission } from '@/games/wumpus/narrative-missions';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


export default function MissionSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const { chapterId } = params;

  const chapter = chapters.find(c => c.id === chapterId);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [logModal, setLogModal] = useState<{ title: string; content: React.ReactNode } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('completedMissions') || '{}');
      setCompletedMissions(completed);
    }
  }, []);

  const handleMissionSelect = (mission: Mission, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    setIsLoading(mission.id);
    router.push(`/games/wumpus/play/narrative/${chapterId}/${mission.id}`);
  };
  
  const handleShowLog = (mission: Mission) => {
    if (!mission.dataLog) return;
    setLogModal({
      title: mission.dataLog.title,
      content: (
         <div className="text-left font-mono text-xs space-y-2 my-4 max-h-[40vh] overflow-y-auto pr-2">
            {mission.dataLog.content.map((line, index) => (
                <div key={index}>{line.startsWith('>') ? <span>&gt; </span> : ''}<span className={line.startsWith('>') ? 'text-wumpus-accent' : ''}>{line.replace('>','')}</span></div>
            ))}
        </div>
      ),
    });
  };

  const handleShowSummary = () => {
    if (!chapter || !chapter.summary) return;
    setLogModal({
        title: chapter.summary.title,
        content: (
            <div className="text-left font-mono text-xs space-y-2 my-4 max-h-[40vh] overflow-y-auto pr-2">
                {chapter.summary.content.map((line, index) => (
                    <div key={index} className="mb-2">{line}</div>
                ))}
            </div>
        )
    })
  }

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

  const allMissionsCompleted = chapter.missions.every(m => completedMissions[m.id]);

  return (
    <>
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-wumpus-background text-wumpus-foreground p-4">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-wumpus-primary uppercase animate-pulse mb-2">
          {chapter.title}
        </h1>
        <p className="text-wumpus-foreground/70 mb-8 text-md">
          {chapter.subtitle}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {chapter.missions.map((mission, index) => {
            const isCompleted = completedMissions[mission.id];
            const isUnlocked = index === 0 || completedMissions[chapter.missions[index - 1].id];
            
            return (
                 <div
                    key={mission.id}
                    className={cn(
                        "group relative flex flex-col overflow-hidden rounded-lg border border-wumpus-accent/20 bg-wumpus-card/80 p-4 text-left transition-all duration-300 ease-in-out fade-in",
                        isUnlocked ? "cursor-pointer hover:border-wumpus-primary hover:shadow-glow-wumpus-primary hover:-translate-y-1" : "opacity-50 cursor-not-allowed",
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleMissionSelect(mission, isUnlocked)}
                    >
                    <div className="flex justify-between items-start">
                         <h2 className="text-lg font-bold text-wumpus-primary">{mission.title}</h2>
                        {isCompleted && mission.dataLog && (
                            <button onClick={(e) => { e.stopPropagation(); handleShowLog(mission); }} className="text-wumpus-accent hover:text-wumpus-primary transition-colors">
                                <BookOpen className="h-5 w-5"/>
                            </button>
                        )}
                    </div>
                    <div className="mt-2 border-t border-wumpus-accent/10 pt-2">
                        <p className="text-xs font-semibold mb-2 text-wumpus-accent flex items-center gap-2"><Server/> Objetivo del Registro:</p>
                        <p className="text-xs text-wumpus-foreground/80">{mission.objective}</p>
                    </div>

                    {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                            <Lock className="h-8 w-8 mb-2 text-wumpus-danger"/>
                            <span className="font-bold text-wumpus-danger">BLOQUEADO</span>
                        </div>
                    )}
                </div>
            );
          })}

          {/* Chapter Summary Card */}
          <div
            className={cn(
                "group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-wumpus-accent/20 bg-wumpus-card/50 p-4 text-center transition-all duration-300 ease-in-out fade-in",
                allMissionsCompleted ? "cursor-pointer hover:border-wumpus-primary hover:shadow-glow-wumpus-primary hover:-translate-y-1" : "opacity-50 cursor-not-allowed",
            )}
            style={{ animationDelay: `${chapter.missions.length * 100}ms` }}
            onClick={() => allMissionsCompleted && handleShowSummary()}
            >
             <BrainCircuit className={cn("h-10 w-10 mb-2 transition-colors", allMissionsCompleted ? "text-wumpus-primary" : "text-wumpus-foreground/30")} />
             <h2 className="text-lg font-bold text-wumpus-primary">Resumen del Capítulo</h2>
             <p className="text-xs text-wumpus-foreground/60 mt-1">Completa todas las misiones para desbloquear el informe final.</p>
             {!allMissionsCompleted && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <Lock className="h-8 w-8 mb-2 text-wumpus-danger"/>
                 </div>
             )}
            </div>

        </div>
      </div>
      
      <Button variant="ghost" onClick={() => router.push('/games/wumpus/play/narrative')} className="mt-12 text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la Selección de Capítulos
      </Button>
    </main>

    <AlertDialog open={!!logModal} onOpenChange={() => setLogModal(null)}>
        <AlertDialogContent className="bg-wumpus-card text-wumpus-foreground border-wumpus-accent">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl text-wumpus-accent flex items-center justify-center gap-2"><Server /> {logModal?.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-wumpus-foreground/80">{logModal?.content}</div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLogModal(null)} className="w-full bg-wumpus-accent text-black hover:bg-wumpus-accent/80">
              Cerrar Registro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </>
  );
}
