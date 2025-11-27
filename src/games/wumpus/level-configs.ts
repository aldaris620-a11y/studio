
export type LevelConfig = {
  level: number;
  gridSize: number;
  arrows: number;
  wumpusCount: number;
  pitCount: number;
  batCount: number;
  staticCount: number;
  lockdownCount: number;
  ghostCount: number;
  wumpusMoveChance: number; // Probability (0 to 1)
};

export const levelConfigs: LevelConfig[] = [
  // Narrative Chapter 1 (Levels 1-10) - Adjusted to 4x4 and easy difficulty
  { level: 1, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 1, batCount: 1, staticCount: 0, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0 },
  { level: 2, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 1, batCount: 2, staticCount: 0, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0 },
  { level: 3, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 2, batCount: 1, staticCount: 1, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0 },
  { level: 4, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 2, batCount: 2, staticCount: 1, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0 },
  { level: 5, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 2, batCount: 2, staticCount: 1, lockdownCount: 1, ghostCount: 0, wumpusMoveChance: 0.1 },
  { level: 6, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 3, batCount: 2, staticCount: 2, lockdownCount: 1, ghostCount: 0, wumpusMoveChance: 0.1 },
  { level: 7, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 3, batCount: 3, staticCount: 2, lockdownCount: 1, ghostCount: 0, wumpusMoveChance: 0.15 },
  { level: 8, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 3, batCount: 3, staticCount: 2, lockdownCount: 2, ghostCount: 0, wumpusMoveChance: 0.15 },
  { level: 9, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 3, batCount: 3, staticCount: 3, lockdownCount: 2, ghostCount: 1, wumpusMoveChance: 0.2 },
  { level: 10, gridSize: 4, arrows: 0, wumpusCount: 1, pitCount: 4, batCount: 3, staticCount: 3, lockdownCount: 2, ghostCount: 1, wumpusMoveChance: 0.2 },
  
  // Hunt Mode Levels (Levels 11-20)
  { level: 11, gridSize: 3, arrows: 2, wumpusCount: 1, pitCount: 1, batCount: 1, staticCount: 0, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0.1 },
  { level: 12, gridSize: 3, arrows: 3, wumpusCount: 1, pitCount: 2, batCount: 1, staticCount: 0, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0.15 },
  { level: 13, gridSize: 4, arrows: 3, wumpusCount: 1, pitCount: 2, batCount: 2, staticCount: 1, lockdownCount: 0, ghostCount: 0, wumpusMoveChance: 0.2 },
  { level: 14, gridSize: 4, arrows: 3, wumpusCount: 1, pitCount: 3, batCount: 2, staticCount: 2, lockdownCount: 1, ghostCount: 0, wumpusMoveChance: 0.25 },
  { level: 15, gridSize: 5, arrows: 4, wumpusCount: 1, pitCount: 3, batCount: 2, staticCount: 2, lockdownCount: 2, ghostCount: 1, wumpusMoveChance: 0.3 },
  { level: 16, gridSize: 5, arrows: 4, wumpusCount: 1, pitCount: 4, batCount: 3, staticCount: 2, lockdownCount: 2, ghostCount: 1, wumpusMoveChance: 0.35 },
  { level: 17, gridSize: 6, arrows: 4, wumpusCount: 1, pitCount: 4, batCount: 3, staticCount: 3, lockdownCount: 2, ghostCount: 2, wumpusMoveChance: 0.4 },
  { level: 18, gridSize: 6, arrows: 5, wumpusCount: 1, pitCount: 5, batCount: 4, staticCount: 3, lockdownCount: 3, ghostCount: 2, wumpusMoveChance: 0.45 },
  { level: 19, gridSize: 7, arrows: 5, wumpusCount: 1, pitCount: 5, batCount: 4, staticCount: 4, lockdownCount: 3, ghostCount: 3, wumpusMoveChance: 0.5 },
  { level: 20, gridSize: 7, arrows: 5, wumpusCount: 1, pitCount: 6, batCount: 5, staticCount: 4, lockdownCount: 4, ghostCount: 3, wumpusMoveChance: 0.6 },
];
