export const GameConfig = {
  // Grid dimensions
  sectorCount: 24,
  ringCount: 12,
  coreRadius: 48,
  ringSpacing: 20,

  // Difficulty & Gameplay
  initialVelocity: 2.0, // rings per second (initial fall speed)
  velocityIncrement: 0.15, // speed increase per level
  maxVelocity: 8.0, // maximum fall speed
  fastDropMultiplier: 3.0, // speed multiplier when fast-dropping

  // Matching
  minMatchLength: 3, // minimum blocks for a match
  colorCount: 4, // number of block colors (1-4)

  // Scoring
  baseScore: 100, // base score per block cleared
  comboMultiplier: 1.5, // score multiplier per combo level
  maxCombo: 8, // maximum combo level

  // Beat Sync
  defaultBpm: 120, // default beats per minute

  // Deprecated (keeping for backward compatibility)
  gravityPerSecond: 2.4,
} as const;

export type GameConfigKey = keyof typeof GameConfig;
