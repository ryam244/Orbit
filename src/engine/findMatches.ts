import { GameConfig } from '../constants/GameConfig';
import { getIndex, wrapSector } from '../utils/grid';
import type { Match } from './types';

/**
 * Minimum number of consecutive blocks required for a match
 */
const MIN_MATCH_LENGTH = 3;

/**
 * Finds all matches in the grid
 * Scans both ring direction (circular) and sector direction (radial)
 *
 * @param grid - Game grid as Uint8Array
 * @param sectorCount - Number of sectors (default: GameConfig.sectorCount)
 * @param ringCount - Number of rings (default: GameConfig.ringCount)
 * @returns Array of matches with indices and colors
 */
export const findMatches = (
  grid: Uint8Array,
  sectorCount: number = GameConfig.sectorCount,
  ringCount: number = GameConfig.ringCount
): Match[] => {
  const matches: Match[] = [];
  const matched = new Set<number>(); // Track already matched indices to avoid duplicates

  // 1. Find ring direction matches (circular around each ring)
  for (let ring = 0; ring < ringCount; ring++) {
    const ringMatches = findRingMatches(grid, ring, sectorCount);
    ringMatches.forEach((match) => {
      if (!hasOverlap(matched, match.indices)) {
        matches.push(match);
        match.indices.forEach((idx) => matched.add(idx));
      }
    });
  }

  // 2. Find sector direction matches (radial from core to outer)
  for (let sector = 0; sector < sectorCount; sector++) {
    const sectorMatches = findSectorMatches(grid, sector, sectorCount, ringCount);
    sectorMatches.forEach((match) => {
      if (!hasOverlap(matched, match.indices)) {
        matches.push(match);
        match.indices.forEach((idx) => matched.add(idx));
      }
    });
  }

  return matches;
};

/**
 * Finds matches along a single ring (circular)
 */
function findRingMatches(
  grid: Uint8Array,
  ring: number,
  sectorCount: number
): Match[] {
  const matches: Match[] = [];
  const visited = new Set<number>();

  for (let startSector = 0; startSector < sectorCount; startSector++) {
    if (visited.has(startSector)) continue;

    const startIndex = getIndex(ring, startSector);
    const color = grid[startIndex];

    // Skip empty cells
    if (color === 0) continue;

    // Find consecutive blocks of the same color (wrapping around)
    const indices: number[] = [startIndex];
    visited.add(startSector);

    // Scan forward
    for (let i = 1; i < sectorCount; i++) {
      const sector = wrapSector(startSector + i);
      const index = getIndex(ring, sector);

      if (grid[index] === color) {
        indices.push(index);
        visited.add(sector);
      } else {
        break;
      }
    }

    // Check if match is valid
    if (indices.length >= MIN_MATCH_LENGTH) {
      matches.push({ indices, color });
    }
  }

  return matches;
}

/**
 * Finds matches along a single sector (radial)
 */
function findSectorMatches(
  grid: Uint8Array,
  sector: number,
  sectorCount: number,
  ringCount: number
): Match[] {
  const matches: Match[] = [];
  let ring = 0;

  while (ring < ringCount) {
    const startIndex = getIndex(ring, sector);
    const color = grid[startIndex];

    // Skip empty cells
    if (color === 0) {
      ring++;
      continue;
    }

    // Find consecutive blocks of the same color
    const indices: number[] = [startIndex];
    let currentRing = ring + 1;

    while (currentRing < ringCount) {
      const index = getIndex(currentRing, sector);
      if (grid[index] === color) {
        indices.push(index);
        currentRing++;
      } else {
        break;
      }
    }

    // Check if match is valid
    if (indices.length >= MIN_MATCH_LENGTH) {
      matches.push({ indices, color });
    }

    // Move to next unprocessed ring
    ring = currentRing;
  }

  return matches;
}

/**
 * Checks if any index in the new match is already in the matched set
 */
function hasOverlap(matched: Set<number>, indices: number[]): boolean {
  return indices.some((idx) => matched.has(idx));
}
