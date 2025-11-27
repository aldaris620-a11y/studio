
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';
import { AnimatedLoading } from '@/components/animated-loading';

export default function NarrativeStartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptMission = () => {
    setIsLoading(true);
    router.push('/games/wumpus/play/narrative/mission-1');
  };

  if (isLoading) {
    return <AnimatedLoading text="Iniciando inmersión..." />;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-wumpus-background p-4 font-code">
      <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg border border-wumpus-primary/30 shadow-glow-wumpus-primary bg-black/50 text-wumpus-foreground">
        <div className="p-8 md:p-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-wumpus-primary uppercase fade-in" style={{ animationDelay: '0.5s' }}>
              &gt; OBJETIVOS DE LA MISIÓN: ACTIVO 734
            </h1>
          <div className="mt-6 border-t border-wumpus-accent/20 pt-6 space-y-4 text-base text-wumpus-foreground/80">
                <p className="fade-in" style={{ animationDelay: '1s' }}><span className="text-wumpus-accent">PARA:</span> <span>EXTRACTOR_7</span></p>
                <p className="fade-in" style={{ animationDelay: '1.5s' }}><span className="text-wumpus-accent">DE:</span> <span>AETHELRED INDUSTRIES - DIVISIÓN DE CONTENCIÓN</span></p>
                <p className="fade-in" style={{ animationDelay: '2s' }}><span className="text-wumpus-accent">ASUNTO:</span> <span>Operación de Neutralización Urgente</span></p>
                <p className="mt-4 fade-in" style={{ animationDelay: '2.5s' }}>
                  Se ha detectado una brecha de contención. El Activo 734, un arma biológica clase Tiamat, se ha liberado en los túneles de mantenimiento del Sector Gamma-9 de Neo-Arcadia.
                </p>
                <p className="fade-in" style={{ animationDelay: '3s' }}>
                  Su objetivo es simple: infiltrarse en la red de túneles, rastrear al activo usando su equipo sensorial de última generación y neutralizarlo con fuerza letal. El activo es extremadamente hostil y ha demostrado tener capacidades de interferencia de sistemas.
                </p>
                <p className="font-bold text-wumpus-warning fade-in" style={{ animationDelay: '3.5s' }}>
                  Fracasar no es una opción. La integridad de la infraestructura de Neo-Arcadia está en juego.
                </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 fade-in" style={{ animationDelay: '4s' }}>
            <Button
              size="lg"
              className="bg-wumpus-primary text-wumpus-primary-foreground hover:bg-wumpus-primary/90 text-lg font-bold shadow-glow-wumpus-primary"
              onClick={handleAcceptMission}
            >
              <Play className="mr-2 h-5 w-5" />
              Aceptar Misión
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent text-lg"
              onClick={() => router.push('/games/wumpus/play')}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Rechazar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
