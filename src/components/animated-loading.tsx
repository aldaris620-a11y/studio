
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
            <div className="relative w-48 h-48 mb-8">
                {icons.map((item, index) => {
                    const Icon = item.icon;
                    const animationDelay = `${index * 150}ms`;
                    return (
                        <Icon
                            key={index}
                            className={cn(
                                "absolute h-8 w-8 animate-orbit",
                                item.color
                            )}
                            style={
                                {
                                    '--orbit-radius': '6rem',
                                    '--orbit-duration': '10s',
                                    '--orbit-offset': `${index * (360 / icons.length)}deg`,
                                    animationDelay,
                                } as React.CSSProperties
                            }
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

// Ensure the keyframes are in globals.css
// In globals.css:
/*
@keyframes orbit {
  0% {
    transform: rotate(var(--orbit-offset)) translateY(var(--orbit-radius)) rotate(calc(-1 * var(--orbit-offset)));
  }
  100% {
    transform: rotate(calc(360deg + var(--orbit-offset))) translateY(var(--orbit-radius)) rotate(calc(-360deg - var(--orbit-offset)));
  }
}

.animate-orbit {
  animation: orbit var(--orbit-duration) linear infinite;
}
*/
