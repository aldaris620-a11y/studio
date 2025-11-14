
'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Sword, Shield, Ghost, Rocket, Gem, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [
    { icon: Gamepad2, color: 'text-blue-500' },
    { icon: Sword, color: 'text-red-500' },
    { icon: Shield, color: 'text-green-500' },
    { icon: Ghost, color: 'text-purple-500' },
    { icon: Rocket, color: 'text-orange-500' },
    { icon: Gem, color: 'text-pink-500' },
    { icon: Crown, color: 'text-yellow-500' },
];

const phrases = [
    "Cargando logros...",
    "Desplegando mapas...",
    "Invocando avatares...",
    "Pulverizando píxeles...",
    "Buscando Easter Eggs...",
    "Compilando shaders...",
    "Aplicando buffs de velocidad...",
    "Esquivando bugs...",
];

export function AnimatedLoading({ text }: { text?: string }) {
    const [currentIconIndex, setCurrentIconIndex] = useState(0);
    const [randomPhrase, setRandomPhrase] = useState(phrases[0]);

    useEffect(() => {
        const iconInterval = setInterval(() => {
            setCurrentIconIndex(prevIndex => (prevIndex + 1) % icons.length);
        }, 1500);

        const phraseInterval = setInterval(() => {
            setRandomPhrase(prev => {
                const currentIndex = phrases.indexOf(prev);
                const nextIndex = (currentIndex + 1) % phrases.length;
                return phrases[nextIndex];
            });
        }, 2000);


        return () => {
            clearInterval(iconInterval);
            clearInterval(phraseInterval);
        };
    }, []);

    const CurrentIcon = icons[currentIconIndex].icon;

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background overflow-hidden">
             <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <CurrentIcon
                    key={currentIconIndex}
                    className={cn("h-14 w-14 animate-fade-in-out", icons[currentIconIndex].color)}
                />
            </div>

            <p className="text-lg font-semibold text-foreground text-center px-4">
                {text || randomPhrase}
            </p>
            {text && (
                 <p className="mt-2 text-sm text-muted-foreground text-center px-4">
                    {randomPhrase}
                </p>
            )}
        </div>
    );
}
