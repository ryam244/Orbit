export const GameConfig = {
  sectorCount: 24,
  ringCount: 12,
  coreRadius: 48,
  ringSpacing: 20,
  maxCombo: 8,
  gravityPerSecond: 2.4,
} as const;

export type GameConfigKey = keyof typeof GameConfig;
