export type SpawnContext = {
  nextColor: number;
  sectorCount: number;
};

export type SpawnResult = {
  sector: number;
  color: number;
};

export const spawn = (context: SpawnContext): SpawnResult => {
  // TODO:
  // - choose a spawn sector (random or rule-based)
  // - validate the sector is free in the grid
  // - return the active block color + sector
  return {
    sector: Math.floor(context.sectorCount / 2),
    color: context.nextColor,
  };
};
