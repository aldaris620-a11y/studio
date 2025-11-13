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
      name: 'Odisea Cósmica',
      description: 'Explora vastas galaxias y descubre secretos ancestrales.',
      progress: 75,
      imageUrl: findImage('game-1'),
      imageHint: 'aventura espacial',
    },
    {
      id: 'game-2',
      name: "Aliento de Dragón",
      description: 'Domina los elementos y derrota bestias míticas.',
      progress: 40,
      imageUrl: findImage('game-2'),
      imageHint: 'dragón de fantasía',
    },
    {
      id: 'game-3',
      name: 'Corredor de Neón',
      description: 'Corre por ciudades ciberpunk en vehículos de alta velocidad.',
      progress: 90,
      imageUrl: findImage('game-3'),
      imageHint: 'coche ciberpunk',
    },
    {
      id: 'game-4',
      name: 'Búsqueda en la Jungla',
      description: 'Desentierra tesoros ocultos en una jungla peligrosa.',
      progress: 15,
      imageUrl: findImage('game-4'),
      imageHint: 'ruinas en la jungla',
    },
  ];
};

export const getRewards = async (): Promise<Reward[]> => {
    return [
        {
            id: 'reward-1',
            name: 'Espada Legendaria',
            description: "Una espada poderosa para 'Aliento de Dragón'.",
            gameToUnlock: "Logra 'Explorador de Galaxias' en Odisea Cósmica.",
            unlocked: true,
        },
        {
            id: 'reward-2',
            name: 'Skin de Vehículo Ciberpunk',
            description: "Una nueva y elegante skin para 'Corredor de Neón'.",
            gameToUnlock: "Completa 'La Guarida del Dragón' en Aliento de Dragón.",
            unlocked: false,
        },
        {
            id: 'reward-3',
            name: 'Mapa Antiguo de la Jungla',
            description: "Revela un área secreta en 'Búsqueda en la Jungla'.",
            gameToUnlock: "Gana 10 carreras en Corredor de Neón.",
            unlocked: false,
        },
        {
            id: 'reward-4',
            name: 'Potenciador de Nave Estelar',
            description: "Una mejora de velocidad para 'Odisea Cósmica'.",
            gameToUnlock: "Encuentra el 'Ídolo del Mono Dorado' en Búsqueda en la Jungla.",
            unlocked: true,
        }
    ];
};
