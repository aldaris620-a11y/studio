
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Skull, BrainCircuit, BookHeart } from 'lucide-react';

// Game-specific page components
const WumpusGamePage = React.lazy(() => import('./wumpus/page'));
const TrivialGamePage = React.lazy(() => import('./trivial/page'));
const ZombieNovelGamePage = React.lazy(() => import('./zombie-novel/page'));

export interface GameDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  component: React.ComponentType;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  gameToUnlock: string;
  unlocked: boolean;
};

export const GAMES: GameDefinition[] = [
  {
    id: 'wumpus',
    name: 'Caza del Wumpus',
    description: 'Caza al Wumpus en una cueva oscura y peligrosa.',
    icon: Skull,
    component: WumpusGamePage,
  },
  {
    id: 'trivial',
    name: 'Trivial de Miedo',
    description: 'Demuestra tu conocimiento sobre el género de terror.',
    icon: BrainCircuit,
    component: TrivialGamePage,
  },
  {
    id: 'zombie-novel',
    name: 'Apocalipsis Z',
    description: 'Sobrevive a un apocalipsis zombie tomando decisiones cruciales.',
    icon: BookHeart,
    component: ZombieNovelGamePage,
  },
];

export const getRewards = async (): Promise<Reward[]> => {
    return [
        {
            id: 'reward-1',
            name: 'Flecha de Plata',
            description: "Una flecha especial para 'Caza del Wumpus'.",
            gameToUnlock: "Responde 10 preguntas correctamente en Trivial de Miedo.",
            unlocked: false,
        },
        {
            id: 'reward-2',
            name: 'Pregunta Extra',
            description: "Una vida extra para 'Trivial de Miedo'.",
            gameToUnlock: "Sobrevive 5 días en Apocalipsis Z.",
            unlocked: false,
        },
        {
            id: 'reward-3',
            name: 'Ruta Secreta',
            description: "Desbloquea un nuevo camino en 'Apocalipsis Z'.",
            gameToUnlock: "Caza al Wumpus.",
            unlocked: false,
        }
    ];
};
