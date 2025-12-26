
# Prompt de Replicación del Proyecto: GameSync Hub

## 1. Visión General del Proyecto

**Nombre de la Aplicación**: GameSync Hub

**Objetivo Principal**: Crear una plataforma centralizada para jugadores donde puedan iniciar sesión, ver un panel de control con sus juegos, rastrear su progreso, obtener recompensas que se cruzan entre diferentes juegos y gestionar su perfil de usuario.

**Público Objetivo**: Jugadores que disfrutan de múltiples títulos y quieren una experiencia unificada que recompense su dedicación a través de diferentes ecosistemas de juego.

## 2. Pila Tecnológica (Tech Stack)

- **Framework Principal**: Next.js (con App Router)
- **Lenguaje**: TypeScript
- **Librería de UI**: React
- **Componentes de UI**: ShadCN/UI
- **Estilos**: Tailwind CSS
- **Iconos**: `lucide-react`
- **Backend (BaaS)**: Firebase
  - **Autenticación**: Firebase Authentication (Email/Contraseña)
  - **Base de Datos**: Firestore
- **Inteligencia Artificial**: Genkit (aunque no se ha implementado una funcionalidad específica, el proyecto está preparado para ello).

## 3. Guía de Estilo y Diseño

### 3.1. Paleta de Colores (`globals.css`)
- **Color de Fondo (`--background`)**: Azul claro desaturado. HSL: `207 18% 94%`.
- **Color Primario (`--primary`)**: Azul frío (Steel Blue). HSL: `204 56% 56%`.
- **Color de Acento (`--accent`)**: Verde vibrante. HSL: `120 61% 50%`.
- **Texto Principal (`--foreground`)**: Casi blanco para contraste sobre fondos oscuros. HSL: `210 40% 98%`.
- **Tarjetas/Contenedores (`--card`)**: Un tono ligeramente más oscuro que el fondo para la jerarquía. HSL: `220 13% 15%`.

### 3.2. Tipografía
- **Fuente Principal (Cuerpo y Titulares)**: `Inter` (Sans-serif). Limpia y moderna.
- **Fuente de Código/Monoespaciada**: `Share Tech Mono` para elementos de UI que simulan terminales o texto de sistema (como en el juego "Ecos en la Oscuridad").

### 3.3. Estilo General de Componentes
- Utilizar componentes de **ShadCN/UI** siempre que sea posible (`Button`, `Card`, `Input`, `Dialog`, etc.).
- Los componentes deben tener esquinas redondeadas (`rounded-lg`), sombras sutiles (`shadow-md`) y animaciones de transición suaves para una apariencia profesional.
- Los íconos deben ser de `lucide-react` para mantener un estilo minimalista y moderno.

## 4. Arquitectura de Firebase

### 4.1. Autenticación
- Proveedores habilitados: **Email/Contraseña**.
- Flujo de usuario: Registro, Inicio de Sesión, Recuperación de Contraseña y Cierre de Sesión.
- El `AuthGuard` protege las rutas que requieren autenticación.

### 4.2. Estructura de Firestore
La base de datos está diseñada para ser segura y escalable, con un enfoque centrado en el usuario.

- **Colección Raíz: `users`**
  - Cada documento tiene como ID el `UID` del usuario de Firebase Auth.
  - Almacena el perfil público del usuario: `username`, `avatar` (un emoji), `id`.
  - **Subcolección: `game_progress`**:
    - Almacena el progreso de un usuario en un juego específico.
    - Campos: `gameId`, `level`, `score`, `lastPlayed`.
  - **Subcolección: `user_achievements`**:
    - Almacena los logros desbloqueados por un usuario.
    - Campos: `achievementId`, `gameId`, `dateEarned`.

- **Colección Raíz: `rewards`**
  - Almacena la definición de todas las recompensas disponibles en la aplicación.
  - Es de lectura pública para todos los usuarios autenticados.
  - Campos: `id`, `name`, `description`, `imageUrl`.

### 4.3. Reglas de Seguridad de Firestore (`firestore.rules`)
- **Regla Principal**: Un usuario solo puede leer y escribir en su propio documento de perfil (`/users/{userId}`).
- **Regla de Subcolecciones**: Un usuario solo puede leer (`get`, `list`) y escribir (`create`, `update`, `delete`) en sus propias subcolecciones (`game_progress`, `user_achievements`). Esto es crucial para permitir operaciones como listar y borrar el progreso de un juego.
- **Regla de Recompensas**: Cualquier usuario autenticado puede leer la colección `rewards`.

## 5. Estructura del Proyecto y Flujo de la Aplicación

### 5.1. Directorios Clave
- `src/app/(app)`: Contiene las rutas protegidas de la aplicación (Dashboard, Profile, Settings).
- `src/app/games`: Contiene las páginas y la lógica específica para cada juego.
- `src/components`: Componentes de React reutilizables.
  - `src/components/ui`: Componentes de ShadCN/UI.
- `src/firebase`: Contiene toda la configuración, proveedores, hooks y lógica de Firebase.
- `src/games`: Contiene las definiciones de los juegos y la lógica compartida entre ellos.

### 5.2. Flujo de Navegación
1.  **Página Principal (`/`)**: Landing page pública que presenta la aplicación. Botones para "Iniciar Sesión" y "Registrarse".
2.  **Registro (`/signup`)**: Formulario para crear una nueva cuenta. Requiere nombre de usuario, email, contraseña y aceptación de términos.
3.  **Inicio de Sesión (`/login`)**: Formulario para que los usuarios existentes accedan.
4.  **Panel de Control (`/dashboard`)**: La página principal después de iniciar sesión. Muestra la lista de juegos disponibles y las recompensas entre juegos.
5.  **Página de Juego (`/games/[gameId]`)**: Página de inicio de un juego específico.
6.  **Perfil (`/profile`)**: Permite al usuario actualizar su nombre de usuario y elegir un avatar de una lista de emojis.
7.  **Ajustes (`/settings`)**: Permite cambiar la contraseña, eliminar el progreso de un juego específico y eliminar la cuenta por completo.

## 6. Funcionalidades Detalladas y Lógica de Componentes

### 6.1. Autenticación y Perfil
- **`src/app/(app)/profile/page.tsx`**: Utiliza `react-hook-form` y `zod` para la validación. Lee los datos del usuario desde el documento de Firestore en `users/{userId}`. Al guardar, actualiza tanto el documento de Firestore como el perfil de Firebase Auth (`updateProfile`).
- **`src/components/user-nav.tsx`**: Muestra el avatar y el nombre del usuario en la barra de navegación. El menú desplegable permite navegar al perfil, a los ajustes o cerrar sesión.

### 6.2. Panel de Control (`dashboard`)
- Muestra una tarjeta para cada juego definido en `src/games/index.ts`.
- Cada tarjeta de juego incluye el ícono, nombre, descripción y una barra de progreso (actualmente estática en 0%).
- Incluye botones para "Jugar" (navega a `/games/[gameId]`) y "Logros".
- Muestra una sección de "Recompensas Entre Juegos", que se obtienen de `src/games/index.ts`.

### 6.3. Ajustes de Cuenta (`settings`)
- **Cambio de Contraseña**: Requiere la contraseña actual y la nueva contraseña. Usa `reauthenticateWithCredential` antes de `updatePassword`.
- **Eliminar Progreso de Juego**:
  - Muestra una lista de juegos. Cada uno tiene un botón de "Borrar Progreso".
  - Al hacer clic, se abre un diálogo de confirmación.
  - La función `handleDeleteGameProgress` obtiene todos los documentos de la subcolección `game_progress` del usuario, los filtra en el cliente por `gameId` y luego usa un `writeBatch` para eliminarlos.
- **Eliminar Cuenta**:
  - Un diálogo de confirmación pide la contraseña del usuario.
  - Usa `reauthenticateWithCredential`, luego borra el documento del usuario en Firestore (`deleteDoc`) y finalmente borra el usuario de Firebase Auth (`deleteUser`).

### 6.4. Juego: "Ecos en la Oscuridad" (Wumpus)
Este es el juego más desarrollado y sirve como ejemplo principal de la arquitectura de juego.

- **Estilo**: Tiene su propia hoja de estilos `wumpus.css` con una temática de terminal de ciencia ficción oscura (fondos oscuros, texto de neón rosa y cian).
- **Modos de Juego**:
  1.  **Entrenamiento (`/play/training`)**: Un menú para seleccionar diferentes niveles de práctica.
      - **Tutorial Guiado**: Una serie de tarjetas que explican cada elemento del juego (Wumpus, Pozos, Drones, etc.).
      - **Práctica Fácil/Intermedia/Avanzada**: Versiones jugables del Wumpus en mapas de 4x4, 5x5 y 5x5 con más peligros y un Wumpus que se mueve.
  2.  **Cacería (`/play/hunt`)**: Modo de desafío con niveles de dificultad creciente. El objetivo es matar al Wumpus. Los niveles se definen en `src/games/wumpus/level-configs.ts`.
  3.  **Narrativa (`/play/narrative`)**: Un modo historia dividido en capítulos y misiones. El objetivo no es matar al Wumpus, sino alcanzar un "terminal" en el mapa para descubrir un fragmento de la historia.
      - La progresión de la misión se guarda en `localStorage`.
      - Los detalles de la historia, misiones y diálogos están en `src/games/wumpus/narrative-missions.ts`.

- **Lógica Principal del Juego (Ej: `advanced/page.tsx`)**:
  - **Estado del Juego**: Se maneja con `useState` (`gameMap`, `playerRoomId`, `gameOver`, etc.).
  - **Generación del Mapa**: La función `generateMap` crea una cuadrícula de habitaciones y coloca aleatoriamente los peligros (Wumpus, pozos, drones, etc.), asegurándose de que la habitación inicial esté vacía.
  - **Movimiento**: El jugador se mueve haciendo clic en las habitaciones adyacentes.
  - **Percepciones (Senses)**: En cada turno, se calculan las percepciones (olores, brisas) examinando las habitaciones adyacentes a la del jugador. Estas se muestran en la tarjeta de estado.
  - **Peligros**:
    - **Wumpus**: Si el jugador entra en su habitación, pierde. El Wumpus se puede mover después de un disparo fallido o aleatoriamente en los modos más difíciles.
    - **Pozo**: Si el jugador entra, pierde.
    - **Dron (Bat)**: Si el jugador entra, es transportado a una habitación aleatoria.
    - **Estática**: Bloquea las percepciones del jugador.
    - **Bloqueo**: Sella temporalmente las salidas de la habitación.
    - **Fantasma**: Genera percepciones falsas o confusas.
  - **Disparo**: El jugador tiene un número limitado de flechas. Puede elegir disparar a una habitación adyacente para intentar matar al Wumpus.
  - **Interfaz**: El juego se presenta como una cuadrícula. La habitación del jugador se resalta, y las habitaciones visitadas muestran un ícono de huellas. Los peligros descubiertos también se revelan en el mapa.
  - **Modales (`AlertDialog`)**: Se usan para mostrar mensajes de game over, transporte por dron, bloqueos y registros de datos en el modo narrativo.
  
## 7. Replicación
Para replicar este proyecto:
1.  Configura un nuevo proyecto de Firebase y obtén su `firebaseConfig`. Reemplázala en `src/firebase/config.ts`.
2.  En la consola de Firebase, habilita la **Autenticación por Email/Contraseña**.
3.  Crea una base de datos de **Firestore** en modo de producción.
4.  Copia y pega el contenido de `firestore.rules` en las reglas de seguridad de tu base de datos de Firestore.
5.  Ejecuta `npm install` para instalar todas las dependencias listadas en `package.json`.
6.  Sigue la estructura de archivos y la lógica descrita en este documento para construir cada componente y página. Empieza por el layout, la autenticación y luego el dashboard, y finalmente los juegos.

Este prompt debería proporcionar una base sólida y detallada para recrear "GameSync Hub" con todas sus características actuales.
