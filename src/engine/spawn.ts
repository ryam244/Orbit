import { getIndex } from '../utils/grid';
import type { SpawnContext, SpawnResult } from './types';

/**
 * Spawns a new block at a random or strategic sector
 * Validates that the spawn position is free
 *
 * @param context - Spawn context containing grid, nextColor, and sectorCount
 * @returns Spawn result with sector and color
 * @throws Error if no valid spawn position is available (Game Over condition)
 */
export const spawn = (context: SpawnContext): SpawnResult => {
  const { nextColor, sectorCount, grid } = context;

  // Try to find a free spawn sector
  // Spawn happens at ring 0 (innermost ring)
  const spawnRing = 0;

  // First, try a random sector
  const randomSector = Math.floor(Math.random() * sectorCount);
  if (isSectorFree(grid, spawnRing, randomSector)) {
    return {
      sector: randomSector,
      color: nextColor,
    };
  }

  // If random sector is occupied, scan all sectors
  for (let i = 0; i < sectorCount; i++) {
    const sector = (randomSector + i) % sectorCount;
    if (isSectorFree(grid, spawnRing, sector)) {
      return {
        sector,
        color: nextColor,
      };
    }
  }

  // No free sector found - this is a Game Over condition
  throw new Error('No free spawn position available (Game Over)');
};

/**
 * Checks if a sector is free at the spawn ring
 */
function isSectorFree(grid: Uint8Array, ring: number, sector: number): boolean {
  const index = getIndex(ring, sector);
  return grid[index] === 0;
}

/**
 * Generates a random block color (1-4)
 * Used for determining the next block color
 *
 * @param colorCount - Number of colors available (default: 4)
 * @returns Random color (1 to colorCount)
 */
export const randomColor = (colorCount: number = 4): 1 | 2 | 3 | 4 => {
  return (Math.floor(Math.random() * colorCount) + 1) as 1 | 2 | 3 | 4;
};
