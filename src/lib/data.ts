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
      id: 'game-1',
      name: 'Cosmic Odyssey',
      description: 'Explore vast galaxies and uncover ancient secrets.',
      progress: 75,
      imageUrl: findImage('game-1'),
      imageHint: 'space adventure',
    },
    {
      id: 'game-2',
      name: "Dragon's Breath",
      description: 'Master the elements and defeat mythical beasts.',
      progress: 40,
      imageUrl: findImage('game-2'),
      imageHint: 'fantasy dragon',
    },
    {
      id: 'game-3',
      name: 'Neon Racer',
      description: 'Race through cyberpunk cities in high-speed vehicles.',
      progress: 90,
      imageUrl: findImage('game-3'),
      imageHint: 'cyberpunk car',
    },
    {
      id: 'game-4',
      name: 'Jungle Quest',
      description: 'Unearth hidden treasures in a perilous jungle.',
      progress: 15,
      imageUrl: findImage('game-4'),
      imageHint: 'jungle ruins',
    },
  ];
};

export const getRewards = async (): Promise<Reward[]> => {
    return [
        {
            id: 'reward-1',
            name: 'Legendary Sword',
            description: "A powerful sword for 'Dragon's Breath'.",
            gameToUnlock: "Achieve 'Galaxy Explorer' in Cosmic Odyssey.",
            unlocked: true,
        },
        {
            id: 'reward-2',
            name: 'Cyberpunk Vehicle Skin',
            description: "A sleek new skin for 'Neon Racer'.",
            gameToUnlock: "Complete 'The Dragon's Lair' in Dragon's Breath.",
            unlocked: false,
        },
        {
            id: 'reward-3',
            name: 'Ancient Jungle Map',
            description: "Reveals a secret area in 'Jungle Quest'.",
            gameToUnlock: "Win 10 races in Neon Racer.",
            unlocked: false,
        },
        {
            id: 'reward-4',
            name: 'Starship Booster',
            description: "A speed enhancement for 'Cosmic Odyssey'.",
            gameToUnlock: "Find the 'Golden Monkey Idol' in Jungle Quest.",
            unlocked: true,
        }
    ];
};
