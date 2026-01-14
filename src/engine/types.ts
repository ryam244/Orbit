/**
 * Core type definitions for the Orbit game engine
 * Based on plan.md Section 5
 */

/**
 * Block color enumeration
 * 0 = EMPTY (no block)
 * 1-6 = Actual block colors (CYAN, MAGENTA, YELLOW, GREEN, ORANGE, BLUE)
 */
export type BlockColor = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Grid index for 1D array representation
 * index = ring * sectorCount + sector
 */
export type GridIndex = number;

/**
 * Active (falling) block state
 */
export type ActiveBlock = {
  id: string;
  color: Exclude<BlockColor, 0>; // 1-4 only (no EMPTY)
  sector: number; // 0..sectorCount-1 (integer)
  ringPos: number; // falling position (0..ringCount-1, can be float during fall)
  velocity: number; // units per second
};

/**
 * Game status enumeration
 */
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/**
 * Main engine state
 */
export type EngineState = {
  status: GameStatus;
  score: number;
  combo: number;
  gravityGauge: number; // 0..1
  coreSectorOffset: number; // Core rotation in sector units (int or float)

  // Grid: 1D Uint8Array for GC performance
  // length = ringCount * sectorCount
  grid: Uint8Array;

  // Active falling block
  active: ActiveBlock | null;

  // Next block color preview
  nextColor: Exclude<BlockColor, 0>;

  // Beat Sync (pseudo)
  bpm: number;
  musicStartMs: number; // Start time offset for sync
};

/**
 * User profile and settings
 */
export type UserProfile = {
  userId: string;
  highScore: number;
  neonCrystals: number;
  unlockedSkins: string[];
  settings: {
    bgmVolume: number;
    seVolume: number;
    controlScheme: 'WHEEL' | 'TAP';
    reduceMotion?: boolean;
  };
};

/**
 * Match result from findMatches
 */
export type Match = {
  indices: number[];
  color: BlockColor;
};

/**
 * Result of applying matches
 */
export type ApplyMatchesResult = {
  grid: Uint8Array;
  clearedCount: number;
};

/**
 * Spawn context for new block generation
 */
export type SpawnContext = {
  nextColor: Exclude<BlockColor, 0>;
  sectorCount: number;
  grid: Uint8Array;
};

/**
 * Spawn result
 */
export type SpawnResult = {
  sector: number;
  color: Exclude<BlockColor, 0>;
};

/**
 * Fall state for stepFall function
 */
export type FallState = {
  ringPos: number;
  velocity: number;
};

/**
 * Fall step result
 */
export type FallStepResult = {
  ringPos: number;
  didLand: boolean;
};

/**
 * Lock block input
 */
export type LockInput = {
  grid: Uint8Array;
  index: number;
  color: BlockColor;
};
