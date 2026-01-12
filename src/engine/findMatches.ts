export type Match = {
  indices: number[];
  color: number;
};

export const findMatches = (grid: Uint8Array): Match[] => {
  // TODO:
  // - scan the grid by ring/sector
  // - detect contiguous groups for match rules
  // - return list of matches with indices
  return [];
};
