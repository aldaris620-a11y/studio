
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Skull, AlertTriangle, Shuffle, WifiOff, ShieldAlert, Ghost, Footprints, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    icon: UserCog,
    title: "El Extractor: Eres Tú",
    description: "Este eres tú. Tu misión es navegar por los túneles, cazar al Activo 734 (el Wumpus) y evitar los peligros. Usa tus sentidos para sobrevivir.",
    color: "text-wumpus-primary",
  },
  {
    icon: Skull,
    title: "Activo 734: El Wumpus",
    description: "Tu objetivo. Es mortal en combate cuerpo a cuerpo. Si entras en su habitación, la misión fracasa. Si sientes su presencia cerca, prepárate para disparar.",
    color: "text-wumpus-danger",
  },
  {
    icon: AlertTriangle,
    title: "Peligro: Pozo Estructural",
    description: "Un pozo sin fondo. Caer en uno significa el fin de la misión. Presta atención a las corrientes de aire que indican que hay un pozo cerca.",
    color: "text-wumpus-warning",
  },
  {
    icon: Shuffle,
    title: "Anomalía: Dron de Transporte",
    description: "Drones erráticos que te atraparán y te reubicarán a una sección aleatoria del mapa. Escucha el zumbido de sus rotores para evitarlos.",
    color: "text-wumpus-accent",
  },
  {
    icon: WifiOff,
    title: "Anomalía: Interferencia Estática",
    description: "Estas habitaciones bloquean todos tus sensores. Si estás en una, no recibirás ninguna percepción sobre las habitaciones adyacentes. Procede con extrema cautela.",
    color: "text-gray-400",
  },
  {
    icon: ShieldAlert,
    title: "Peligro: Trampa de Contención",
    description: "Al entrar en una de estas habitaciones, activarás un protocolo de bloqueo temporal, sellando todas las salidas. Deberás esperar a que se desactive.",
    color: "text-orange-400",
  },
  {
    icon: Ghost,
    title: "Anomalía: Datos Fantasma",
    description: "Estas anomalías corrompen tus sensores, mostrando percepciones falsas y confusas. No confíes en tus lecturas cuando sientas su presencia.",
    color: "text-purple-400",
  },
  {
    icon: Footprints,
    title: "Zona Segura: Huellas",
    description: "Este icono marca las habitaciones que ya has visitado y que sabes que son seguras (no contienen ningún peligro). Usa esto para trazar tu ruta.",
    color: "text-wumpus-primary opacity-60",
  },
];


export default function GuidedTutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/games/wumpus/play/training');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="h-full w-full bg-wumpus-background text-wumpus-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-wumpus-card/80 backdrop-blur-sm border-wumpus-primary/20 text-wumpus-foreground">
        <CardHeader>
          <CardTitle className="text-center text-wumpus-primary">
            Tutorial Guiado ({currentStep + 1}/{tutorialSteps.length})
          </CardTitle>
          <CardDescription className="text-center text-wumpus-foreground/60 pt-2">
            Aprende los fundamentos para sobrevivir a la caza.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={cn("p-4 bg-black/30 rounded-lg border border-wumpus-accent/20", step.color)}>
              <Icon className="h-20 w-20" />
          </div>
          <h2 className="text-2xl font-bold font-headline">{step.title}</h2>
          <p className="text-wumpus-foreground/80 min-h-[100px]">
            {step.description}
          </p>
          <div className="flex justify-between w-full pt-4">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0} className="border-wumpus-accent text-wumpus-accent hover:bg-wumpus-accent/10 hover:text-wumpus-accent">
              <ArrowLeft className="mr-2" />
              Anterior
            </Button>
            <Button onClick={handleNext} className="bg-wumpus-primary text-wumpus-primary-foreground hover:bg-wumpus-primary/90">
                {currentStep === tutorialSteps.length - 1 ? (
                    <>
                        Finalizar <CheckCircle className="ml-2" />
                    </>
                ) : (
                    <>
                        Siguiente <ArrowRight className="ml-2" />
                    </>
                )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
