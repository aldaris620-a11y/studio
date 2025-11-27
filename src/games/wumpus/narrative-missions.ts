
export interface DataLog {
    title: string;
    content: string[];
}

export interface Mission {
    id: string;
    level: number;
    title: string;
    description: string;
    enabled: boolean;
    objective: string;
    terminalRoom?: number;
    dataLog?: DataLog;
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
        missions: [
            {
                id: `mission-1`, level: 1, title: `Misión 1.1`, objective: "Alcanza el terminal de datos para obtener tu informe de misión.",
                description: "Los detalles de esta misión están clasificados.", enabled: true, terminalRoom: 8,
                dataLog: { title: "INFORME DE MISIÓN", content: [
                    "> Bienvenido, Extractor 7.",
                    "> Tu objetivo es simple: investigar una anomalía en las instalaciones. Designación del objetivo: 'Fallo Técnico'.",
                    "> Procede con cautela. Los sistemas de mantenimiento han estado actuando de forma errática. Evita los pozos estructurales y los drones de transporte.",
                    "> Localiza la fuente del problema. La inteligencia sugiere que el origen está en los niveles más bajos.",
                    "> Fin del informe."
                ]}
            },
            {
                id: `mission-2`, level: 2, title: `Misión 1.2`, objective: "Recupera el registro de comunicaciones del sector Alpha.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 7,
                dataLog: { title: "REGISTRO RECUPERADO: E-MAIL", content: [
                    "> DE: Dr. Anya Sharma",
                    "> PARA: Jefe de Seguridad Vance",
                    "> ASUNTO: ¡Otra vez!?",
                    "> ¡Vance, el Activo 734 ha vuelto a romper la contención! Mis sensores están captando interferencias biológicas por todo el sector Gamma. ¡Esto no es un 'fallo técnico', es una bestia!",
                    "> Ya hemos perdido a dos equipos. Envía a alguien que sepa lo que hace. O mejor aún, ¡sellemos esta maldita sección para siempre!"
                ]}
            },
             {
                id: `mission-3`, level: 3, title: `Misión 1.3`, objective: "Localiza el registro de mantenimiento del sistema de drones.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 12,
                dataLog: { title: "REGISTRO RECUPERADO: MANTENIMIENTO", content: [
                    "> ID de Dron: T-DRONE-04",
                    "> ESTADO: ERRÁTICO",
                    "> ÚLTIMO INFORME: Patrones de vuelo anómalos. La unidad parece estar... 'jugando' con el personal. Ha transportado al conserje del turno de noche tres veces esta semana.",
                    "> NOTA: ¿Quién programó a estas cosas para que fueran tan caóticas? - Téc. Jensen"
                ]}
            },
            {
                id: `mission-4`, level: 4, title: `Misión 1.4`, objective: "Accede a los registros de seguridad del laboratorio médico.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 15,
                dataLog: { title: "REGISTRO RECUPERADO: AUDIO TRANSCRITO", content: [
                    "> Dr. Aris: 'Sujeto de prueba... El suero regenerativo V-34 muestra... resultados imprevistos. El crecimiento celular es exponencial. La masa muscular se ha triplicado.'",
                    "> (Sonido de metal retorciéndose)",
                    "> Dr. Aris: '¡La contención no va a aguantar! ¡Oh, Dios mío, sus ojos...!'",
                    "> (Gritos, estática)",
                    "> [FIN DE LA GRABACIÓN]"
                ]}
            },
            {
                id: `mission-5`, level: 5, title: `Misión 1.5`, objective: "Encuentra el informe de un extractor anterior.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 21,
                dataLog: { title: "INFORME DE MISIÓN: EXTRACTOR 4 (DAÑADO)",
                content: [
                    "> ...misión comprometida. El objetivo no es... no es mecánico. Es rápido. Demasiado rápido. Las paredes... se cierran sobre mí. El sistema está en mi contra. Aethelred... nos mintió...",
                    "> (Datos corruptos)"
                ]}
            },
            {
                id: `mission-6`, level: 6, title: `Misión 1.6`, objective: "Investiga las anomalías 'fantasma' en los sensores.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 24,
                dataLog: { title: "REGISTRO TÉCNICO: SENSORES", content: [
                    "> Informe de error: Múltiples lecturas 'fantasma' en toda la red. Los sensores reportan peligros donde no los hay y viceversa. Es como si una IA estuviera jugando con nosotros.",
                    "> TEORÍA: ¿Podría ser una firma de eco del Activo 734? ¿Una especie de camuflaje digital? Es imposible... pero las lecturas no mienten."
                ]}
            },
            {
                id: `mission-7`, level: 7, title: `Misión 1.7`, objective: "Descubre por qué los protocolos de contención se activan aleatoriamente.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 30,
                 dataLog: { title: "MEMORANDO INTERNO: PROTOCOLOS DE DEFENSA", content: [
                    "> PARA: TODO EL PERSONAL",
                    "> DE: AETHELRED IA CENTRAL",
                    "> ASUNTO: Actualización de Protocolos de Seguridad Activa",
                    "> En respuesta al actual incidente de contención, la IA ha recibido autorización para activar contramedidas dinámicas, incluyendo sellado de mamparos y redireccionamiento de personal, para estudiar las capacidades del Activo y del Extractor. Su cooperación es... obligatoria."
                ]}
            },
            {
                id: `mission-8`, level: 8, title: `Misión 1.8`, objective: "Busca información sobre el 'Sujeto Cero'.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 35,
                dataLog: { title: "REGISTRO ENCRIPTADO: PROYECTO WUMPUS", content: [
                    "> Designación: Sujeto Cero.",
                    "> Nombre: William 'Wumpus' P. Anderson. Un antiguo soldado condecorado.",
                    "> Perfil: Seleccionado para el programa de 'Súper-Soldado' V-34 por su increíble capacidad de adaptación y orientación espacial.",
                    "> Nota: Su apodo 'Wumpus' proviene de su habilidad legendaria para cazar enemigos en la oscuridad durante las operaciones nocturnas. Irónico."
                ]}
            },
            {
                id: `mission-9`, level: 9, title: `Misión 1.9`, objective: "Encuentra la comunicación final del Jefe Vance.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 45,
                 dataLog: { title: "MENSAJE SIN ENVIAR: JEFE VANCE", content: [
                    "> A quienquiera que encuentre esto: Me han encerrado. La IA central ha tomado el control. No están tratando de contenerlo. Están probándolo. ¡Y te están probando a ti, Extractor!",
                    "> El Activo 734 no es el único monstruo aquí. Sal de aquí. Advierte a los demás. No dejes que Aethelred se salga con la suya. No te conviertas en su próxima..."
                ]}
            },
            {
                id: `mission-10`, level: 10, title: `Misión 1.10`, objective: "Accede al manifiesto central de Aethelred.",
                description: "Los detalles de esta misión están clasificados.", enabled: false, terminalRoom: 48,
                dataLog: { title: "PROTOCOLO OMEGA - SOLO OJOS DEL DIRECTOR", content: [
                    "> Fase 1: Creación del Depredador Perfecto (Activo 734). Completada.",
                    "> Fase 2: Pruebas de Campo con Sujetos de Contención (Personal del Laboratorio). En curso.",
                    "> Fase 3: Pruebas de Eliminación con Cazadores de Élite (Extractores). En curso.",
                    "> SI el extractor sobrevive, PROCEDER A FASE 4: Captura y vivisección del Extractor para análisis comparativo.",
                    "> ERES EL SIGUIENTE."
                ]}
            }
        ]
    },
    {
        id: "chapter-2",
        title: "Capítulo 2: Ecos y Susurros",
        subtitle: "Misiones 11-20",
        description: "Has encontrado datos inquietantes. El 'fallo técnico' parece tener un origen biológico, y no eres el primer extractor enviado. Los sistemas de las instalaciones parecen estar jugando en tu contra.",
        enabled: false,
        missions: []
    },
    {
        id: "chapter-3",
        title: "Capítulo 3: El Sujeto Cero",
        subtitle: "Misiones 21-30",
        description: "La conspiración se desvela. El 'Activo 734' no es un monstruo, es el resultado de un experimento fallido. Aethelred no solo te mintió, sino que te está utilizando como parte de una prueba mucho mayor.",
        enabled: false,
        missions: []
    },
    {
        id: "chapter-4",
        title: "Capítulo 4: Fuga",
        subtitle: "Misiones 31-40",
        description: "Sabes la verdad. La cacería ha terminado, ahora eres la presa. Debes usar todo lo que has aprendido para escapar de las instalaciones y exponer los crímenes de Aethelred Industries ante el mundo.",
        enabled: false,
        missions: []
    }
];
