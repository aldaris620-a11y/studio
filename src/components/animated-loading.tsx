
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

export function AnimatedLoading({ text }: { text?: string }) {
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    useEffect(() => {
        const iconInterval = setInterval(() => {
            setCurrentIconIndex(prevIndex => (prevIndex + 1) % icons.length);
        }, 1500);

        return () => {
            clearInterval(iconInterval);
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
            {text && <p className="text-lg font-semibold text-foreground text-center px-4">
                {text}
            </p>}
        </div>
    );
}
