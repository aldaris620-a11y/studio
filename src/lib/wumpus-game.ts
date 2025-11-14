// Cueva dodecaédrica con 20 habitaciones y 3 túneles por habitación
const CAVE_CONNECTIONS: { [key: number]: number[] } = {
  1: [2, 5, 8],   2: [1, 3, 10],  3: [2, 4, 12],  4: [3, 5, 14],  5: [1, 4, 6],
  6: [5, 7, 15],   7: [6, 8, 17],   8: [1, 7, 9],   9: [8, 10, 18], 10: [2, 9, 11],
  11: [10, 12, 19], 12: [3, 11, 13], 13: [12, 14, 20], 14: [4, 13, 15], 15: [6, 14, 16],
  16: [15, 17, 20], 17: [7, 16, 18], 18: [9, 17, 19], 19: [11, 18, 20], 20: [13, 16, 19],
};

export type Hazard = 'wumpus' | 'pit' | 'bat';
export type Cave = { [room: number]: Hazard[] };

export interface GameState {
  playerRoom: number;
  wumpusRoom: number;
  wumpusAwake: boolean;
  arrows: number;
  gameOver: boolean;
  message: string;
  adjacentRooms: number[];
  warnings: string[];
}

export class WumpusGame {
  private playerRoom: number;
  private wumpusRoom: number;
  private batRooms: number[];
  private pitRooms: number[];
  private arrows: number;
  private wumpusAwake: boolean = false;
  private gameOver: boolean = false;
  private message: string;
  public cave: Cave = {};

  constructor(private numRooms = 20, private numArrows = 5, private numBats = 3, private numPits = 3) {
    this.playerRoom = 1;
    this.wumpusRoom = 1;
    this.batRooms = [];
    this.pitRooms = [];
    this.arrows = numArrows;
    this.message = '';
    this.setupCave();
  }

  private setupCave() {
    // Inicializa la cueva vacía
    for (let i = 1; i <= this.numRooms; i++) {
      this.cave[i] = [];
    }

    // Coloca al jugador, Wumpus, murciélagos y pozos
    const emptyRooms = Array.from({ length: this.numRooms }, (_, i) => i + 1);
    
    // Colocar Wumpus, pozos y murciélagos en habitaciones aleatorias diferentes del inicio
    const playerStartRoom = 1;
    let availableRooms = emptyRooms.filter(r => r !== playerStartRoom);

    const placeItem = (item: Hazard, count: number): number[] => {
        const placedIn: number[] = [];
        for (let i = 0; i < count; i++) {
            const roomIndex = Math.floor(Math.random() * availableRooms.length);
            const room = availableRooms[roomIndex];
            this.cave[room].push(item);
            placedIn.push(room);
            availableRooms.splice(roomIndex, 1);
        }
        return placedIn;
    }

    [this.wumpusRoom] = placeItem('wumpus', 1);
    this.pitRooms = placeItem('pit', this.numPits);
    this.batRooms = placeItem('bat', this.numBats);
    this.playerRoom = playerStartRoom; // El jugador siempre empieza en la habitación 1

    this.message = "¡Bienvenido a Cazar al Wumpus!";
  }

  private getWarnings(): string[] {
    const warnings = new Set<string>();
    const adjacent = CAVE_CONNECTIONS[this.playerRoom];
    adjacent.forEach(room => {
      if (this.cave[room]?.includes('wumpus')) warnings.add("Hueles al Wumpus cerca.");
      if (this.cave[room]?.includes('pit')) warnings.add("Sientes una brisa.");
      if (this.cave[room]?.includes('bat')) warnings.add("Oyes un aleteo.");
    });
    return Array.from(warnings);
  }

  private checkHazards() {
    const currentHazards = this.cave[this.playerRoom];

    if (currentHazards.includes('wumpus')) {
      if (this.wumpusAwake) {
        this.message = "¡El Wumpus te ha devorado! Has perdido.";
        this.gameOver = true;
      } else {
        this.message = "¡Has despertado al Wumpus! Se ha movido a una habitación cercana.";
        this.wumpusAwake = true;
        // Mover Wumpus
        const adjacent = CAVE_CONNECTIONS[this.wumpusRoom];
        const newWumpusRoom = adjacent[Math.floor(Math.random() * adjacent.length)];
        this.cave[this.wumpusRoom] = this.cave[this.wumpusRoom].filter(h => h !== 'wumpus');
        this.wumpusRoom = newWumpusRoom;
        this.cave[this.wumpusRoom].push('wumpus');
        
        // Comprobar si el jugador está en la nueva habitación del Wumpus
        if (this.playerRoom === this.wumpusRoom) {
          this.message = "¡Te has movido a la misma habitación que el Wumpus! ¡Te ha devorado!";
          this.gameOver = true;
        }
      }
      return;
    }

    if (currentHazards.includes('pit')) {
      this.message = "¡Has caído en un pozo! Fin del juego.";
      this.gameOver = true;
      return;
    }

    if (currentHazards.includes('bat')) {
      this.message = "¡Unos murciélagos te han transportado a otra habitación!";
      this.playerRoom = Math.floor(Math.random() * this.numRooms) + 1;
      this.checkHazards(); // Volver a comprobar los peligros en la nueva habitación
    }
  }

  public getState(): GameState {
    if (this.gameOver) {
      return {
        playerRoom: this.playerRoom,
        wumpusRoom: this.wumpusRoom,
        wumpusAwake: this.wumpusAwake,
        arrows: this.arrows,
        gameOver: this.gameOver,
        message: this.message,
        adjacentRooms: [],
        warnings: []
      };
    }
    
    return {
      playerRoom: this.playerRoom,
      wumpusRoom: this.wumpusRoom,
      wumpusAwake: this.wumpusAwake,
      arrows: this.arrows,
      gameOver: this.gameOver,
      message: this.message,
      adjacentRooms: CAVE_CONNECTIONS[this.playerRoom],
      warnings: this.getWarnings()
    };
  }

  public move(room: number) {
    if (this.gameOver) return;
    if (CAVE_CONNECTIONS[this.playerRoom].includes(room)) {
      this.playerRoom = room;
      this.message = `Te has movido a la habitación ${room}.`;
      this.checkHazards();
    } else {
      this.message = "No puedes moverte a esa habitación desde aquí.";
    }
  }

  public shoot(room: number) {
    if (this.gameOver) return;
    if (this.arrows <= 0) {
      this.message = "¡No te quedan flechas!";
      return;
    }

    this.arrows--;
    this.wumpusAwake = true;

    if (CAVE_CONNECTIONS[this.playerRoom].includes(room)) {
      if (this.wumpusRoom === room) {
        this.message = "¡Felicidades! ¡Has matado al Wumpus y ganado el juego!";
        this.gameOver = true;
      } else {
        this.message = `Tu flecha vuela hacia la habitación ${room} y no encuentra nada. El Wumpus se ha despertado.`;
        // Mover Wumpus
        const adjacent = CAVE_CONNECTIONS[this.wumpusRoom];
        const newWumpusRoom = adjacent[Math.floor(Math.random() * adjacent.length)];
        this.cave[this.wumpusRoom] = this.cave[this.wumpusRoom].filter(h => h !== 'wumpus');
        this.wumpusRoom = newWumpusRoom;
        this.cave[this.wumpusRoom].push('wumpus');
      }
    } else {
      this.message = "No puedes disparar a una habitación no adyacente.";
    }
    
    if (this.arrows === 0 && !this.gameOver) {
        this.message += " Te has quedado sin flechas. ¡Fin del juego!";
        this.gameOver = true;
    }
  }

  public newGame() {
    this.playerRoom = 1;
    this.wumpusRoom = 1;
    this.batRooms = [];
    this.pitRooms = [];
    this.arrows = this.numArrows;
    this.wumpusAwake = false;
    this.gameOver = false;
    this.message = '';
    this.setupCave();
  }
}
