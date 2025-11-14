
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
    const [currentPhrase, setCurrentPhrase] = useState(text || phrases[0]);
    const animationDuration = 3.5; // seconds for a single icon loop
    const iconCount = icons.length;
    const totalAnimationTime = animationDuration * iconCount;


    useEffect(() => {
        if (text) return; // If a specific text is provided, don't cycle.

        const intervalId = setInterval(() => {
            setCurrentPhrase(prev => {
                const currentIndex = phrases.indexOf(prev);
                const nextIndex = (currentIndex + 1) % phrases.length;
                return phrases[nextIndex];
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background overflow-hidden">
             <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                {icons.map((item, index) => {
                    const Icon = item.icon;
                    const animationDelay = `${index * animationDuration}s`;
                    return (
                        <Icon
                            key={index}
                            className={cn(
                                "absolute h-10 w-10 animate-carousel-horizontal",
                                item.color
                            )}
                            style={{ 
                                animationDuration: `${totalAnimationTime}s`,
                                animationDelay 
                            } as React.CSSProperties}
                        />
                    )
                })}
            </div>

            <p className="mt-4 text-lg font-semibold text-foreground text-center px-4">
                {currentPhrase}
            </p>
        </div>
    );
}
