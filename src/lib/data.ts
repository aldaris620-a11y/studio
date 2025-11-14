import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export type Game = {
  id: string;
  name: string;
  description: string;
  progress: number;
  imageUrl: string;
  imageHint: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  gameToUnlock: string;
  unlocked: boolean;
};

export const getGames = async (): Promise<Game[]> => {
  return [
    {
      id: 'wumpus-1',
      name: 'Caza del Wumpus',
      description: 'Caza al Wumpus en una cueva oscura y peligrosa.',
      progress: 0,
      imageUrl: findImage('wumpus-1'),
      imageHint: 'dark cave',
    },
    {
      id: 'trivial-1',
      name: 'Trivial de Miedo',
      description: 'Demuestra tu conocimiento sobre el género de terror.',
      progress: 0,
      imageUrl: findImage('trivial-1'),
      imageHint: 'scary trivia',
    },
    {
      id: 'zombie-novel-1',
      name: 'Apocalipsis Z: Novela Visual',
      description: 'Sobrevive a un apocalipsis zombie tomando decisiones cruciales.',
      progress: 0,
      imageUrl: findImage('zombie-novel-1'),
      imageHint: 'zombie apocalypse',
    },
  ];
};

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
