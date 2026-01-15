export const GameConfig = {
  // Grid dimensions
  sectorCount: 24,
  ringCount: 12,
  coreRadius: 48,
  ringSpacing: 20,

  // Difficulty & Gameplay
  initialVelocity: 3.0, // rings per second (initial fall speed) - tuned for better pacing
  velocityIncrement: 0.2, // speed increase per level
  maxVelocity: 10.0, // maximum fall speed
  fastDropMultiplier: 4.0, // speed multiplier when fast-dropping (12 rings/sec)

  // Matching
  minMatchLength: 3, // minimum blocks for a match
  colorCount: 4, // number of block colors (1-4)

  // Scoring
  baseScore: 100, // base score per block cleared
  comboMultiplier: 1.5, // score multiplier per combo level
  maxCombo: 10, // maximum combo level (increased from 8)

  // Beat Sync
  defaultBpm: 120, // default beats per minute

  // Visual
  blockRadius: 8, // visual size of blocks
  glowIntensity: 0.5, // glow effect intensity (0-1)

  // Deprecated (keeping for backward compatibility)
  gravityPerSecond: 2.4,
} as const;

export type GameConfigKey = keyof typeof GameConfig;
