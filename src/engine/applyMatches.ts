import { GameConfig } from '../constants/GameConfig';
import { getIndex, getRing, getSector } from '../utils/grid';
import type { Match, ApplyMatchesResult } from './types';

/**
 * Applies matches to the grid by clearing blocks and applying gravity
 *
 * @param grid - Game grid as Uint8Array
 * @param matches - Array of matches to apply
 * @param sectorCount - Number of sectors (default: GameConfig.sectorCount)
 * @param ringCount - Number of rings (default: GameConfig.ringCount)
 * @returns Updated grid and count of cleared blocks
 */
export const applyMatches = (
  grid: Uint8Array,
  matches: Match[],
  sectorCount: number = GameConfig.sectorCount,
  ringCount: number = GameConfig.ringCount
): ApplyMatchesResult => {
  // Create immutable copy
  const next = new Uint8Array(grid);
  let clearedCount = 0;

  // 1. Clear all matched blocks
  matches.forEach((match) => {
    match.indices.forEach((index) => {
      if (next[index] !== 0) {
        next[index] = 0;
        clearedCount += 1;
      }
    });
  });

  // 2. Apply gravity sector by sector
  // Blocks fall toward the outer ring (higher ring index)
  for (let sector = 0; sector < sectorCount; sector++) {
    applyGravityToSector(next, sector, sectorCount, ringCount);
  }

  return { grid: next, clearedCount };
};

/**
 * Applies gravity to a single sector
 * Blocks fall from inner rings (low index) to outer rings (high index)
 */
function applyGravityToSector(
  grid: Uint8Array,
  sector: number,
  sectorCount: number,
  ringCount: number
): void {
  // Collect all non-empty blocks in this sector
  const blocks: number[] = [];

  for (let ring = 0; ring < ringCount; ring++) {
    const index = getIndex(ring, sector);
    const color = grid[index];

    if (color !== 0) {
      blocks.push(color);
      grid[index] = 0; // Clear the cell
    }
  }

  // Place blocks starting from the outer ring (highest index)
  // This simulates gravity pulling blocks outward
  let writeRing = ringCount - 1;
  for (let i = blocks.length - 1; i >= 0; i--) {
    const index = getIndex(writeRing, sector);
    grid[index] = blocks[i];
    writeRing--;
  }
}
