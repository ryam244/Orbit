import type { LockInput } from './types';

/**
 * Locks a block into the grid at the specified index
 * Creates a new grid copy for immutability
 *
 * @param input - Lock input containing grid, index, and color
 * @returns New grid with the block locked in place
 * @throws Error if the target cell is already occupied
 */
export const lockBlock = ({ grid, index, color }: LockInput): Uint8Array => {
  // Validate index bounds
  if (index < 0 || index >= grid.length) {
    throw new Error(`Invalid grid index: ${index} (grid length: ${grid.length})`);
  }

  // Check if target cell is already occupied
  if (grid[index] !== 0) {
    throw new Error(`Cannot lock block at index ${index}: cell is already occupied`);
  }

  // Create immutable copy
  const next = new Uint8Array(grid);

  // Lock the block
  next[index] = color;

  return next;
};
