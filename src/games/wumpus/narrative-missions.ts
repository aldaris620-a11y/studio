
export interface Mission {
    id: string;
    level: number;
    title: string;
    description: string;
    enabled: boolean;
    // Potentially add mission-specific config here later
}

export interface Chapter {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    enabled: boolean;
    missions: Mission[];
}

export const chapters: Chapter[] = [
    {
        id: "chapter-1",
        title: "Capítulo 1: El Incidente Gamma-9",
        subtitle: "Misiones 01-10",
        description: "Tu primer contrato. Aethelred Industries te ha llamado para neutralizar un 'fallo técnico' en sus laboratorios subterráneos. Parece una misión de rutina, pero los informes preliminares son confusos y contradictorios.",
        enabled: true,
        missions: Array.from({ length: 10 }, (_, i) => ({
            id: `mission-1-${i + 1}`,
            level: i + 1,
            title: `Misión 1.${i + 1}`,
            description: "Los detalles de esta misión están clasificados.",
            enabled: i === 0, // Solo la primera misión está habilitada
        }))
    },
    {
        id: "chapter-2",
        title: "Capítulo 2: Ecos y Susurros",
        subtitle: "Misiones 11-20",
        description: "Has encontrado datos inquietantes. El 'fallo técnico' parece tener un origen biológico, y no eres el primer extractor enviado. Los sistemas de las instalaciones parecen estar jugando en tu contra.",
        enabled: false,
        missions: Array.from({ length: 10 }, (_, i) => ({
            id: `mission-2-${i + 1}`,
            level: i + 11,
            title: `Misión 2.${i + 1}`,
            description: "Los detalles de esta misión están clasificados.",
            enabled: false,
        }))
    },
    {
        id: "chapter-3",
        title: "Capítulo 3: El Sujeto Cero",
        subtitle: "Misiones 21-30",
        description: "La conspiración se desvela. El 'Activo 734' no es un monstruo, es el resultado de un experimento fallido. Aethelred no solo te mintió, sino que te está utilizando como parte de una prueba mucho mayor.",
        enabled: false,
        missions: Array.from({ length: 10 }, (_, i) => ({
            id: `mission-3-${i + 1}`,
            level: i + 21,
            title: `Misión 3.${i + 1}`,
            description: "Los detalles de esta misión están clasificados.",
            enabled: false,
        }))
    },
    {
        id: "chapter-4",
        title: "Capítulo 4: Fuga",
        subtitle: "Misiones 31-40",
        description: "Sabes la verdad. La cacería ha terminado, ahora eres la presa. Debes usar todo lo que has aprendido para escapar de las instalaciones y exponer los crímenes de Aethelred Industries ante el mundo.",
        enabled: false,
        missions: Array.from({ length: 10 }, (_, i) => ({
            id: `mission-4-${i + 1}`,
            level: i + 31,
            title: `Misión 4.${i + 1}`,
            description: "Los detalles de esta misión están clasificados.",
            enabled: false,
        }))
    }
];
