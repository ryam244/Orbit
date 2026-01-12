import type { Match } from './findMatches';

export type ApplyMatchesResult = {
  grid: Uint8Array;
  clearedCount: number;
};

export const applyMatches = (grid: Uint8Array, matches: Match[]): ApplyMatchesResult => {
  // TODO:
  // - clear indices found in matches
  // - shift blocks if the game rules require gravity
  // - return updated grid and cleared count
  const next = new Uint8Array(grid);
  let clearedCount = 0;

  matches.forEach((match) => {
    match.indices.forEach((index) => {
      if (next[index] !== 0) {
        next[index] = 0;
        clearedCount += 1;
      }
    });
  });

  return { grid: next, clearedCount };
};
