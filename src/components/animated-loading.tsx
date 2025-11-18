
'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Sword, Shield, Ghost, Rocket, Gem, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [
    { icon: Gamepad2, color: 'text-primary' },
    { icon: Sword, color: 'text-red-500' },
    { icon: Shield, color: 'text-green-500' },
    { icon: Ghost, color: 'text-purple-500' },
    { icon: Rocket, color: 'text-orange-500' },
    { icon: Gem, color: 'text-pink-500' },
    { icon: Crown, color: 'text-yellow-500' },
];

const loadingTexts = [
    "Compilando shaders...",
    "Generando terreno...",
    "Desplegando mapas...",
    "Invocando esbirros...",
    "Buscando Easter Eggs...",
    "Afilando espadas...",
    "Cargando logros...",
    "Pulverizando píxeles...",
    "Invocando al jefe final...",
    "Buscando el botín legendario...",
    "Aplicando buffs...",
    "Ajustando la física cuántica...",
    "Renderizando explosiones épicas...",
    "Negociando con los NPCs...",
    "Evitando trampas mortales...",
    "Descifrando runas antiguas...",
    "Calibrando el motor de saltos...",
    "Contando polígonos...",
    "Activando el modo turbo...",
    "Alimentando al hámster del servidor...",
];

export function AnimatedLoading({ text }: { text?: string }) {
    const [currentIconIndex, setCurrentIconIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const iconInterval = setInterval(() => {
            setCurrentIconIndex(prevIndex => (prevIndex + 1) % icons.length);
        }, 1500);

        let textInterval: NodeJS.Timeout | null = null;
        if (!text) {
            textInterval = setInterval(() => {
                setCurrentTextIndex(prevIndex => (prevIndex + 1) % loadingTexts.length);
            }, 2000);
        }

        return () => {
            clearInterval(iconInterval);
            if (textInterval) {
                clearInterval(textInterval);
            }
        };
    }, [text]);

    const CurrentIcon = icons[currentIconIndex].icon;
    const displayText = text || loadingTexts[currentTextIndex];

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background overflow-hidden">
             <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <CurrentIcon
                    key={currentIconIndex}
                    className={cn("h-14 w-14 animate-fade-in-out", icons[currentIconIndex].color)}
                />
            </div>
            <p className="text-lg font-semibold text-foreground text-center px-4">
                {displayText}
            </p>
        </div>
    );
}
