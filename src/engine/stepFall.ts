import { GameConfig } from '../constants/GameConfig';
import type { FallState, FallStepResult } from './types';

/**
 * Advances the falling block position by velocity * deltaTime
 * Returns the new position and whether the block has landed
 *
 * @param state - Current fall state (ringPos, velocity)
 * @param deltaSeconds - Time elapsed since last frame
 * @param ringCount - Number of rings in the grid (default: GameConfig.ringCount)
 * @returns New ring position and landing flag
 */
export const stepFall = (
  state: FallState,
  deltaSeconds: number,
  ringCount: number = GameConfig.ringCount
): FallStepResult => {
  // Calculate new position
  const newRingPos = state.ringPos + state.velocity * deltaSeconds;

  // Landing occurs when block reaches or exceeds the last ring
  // The last ring is at index (ringCount - 1)
  const didLand = newRingPos >= ringCount - 1;

  // Clamp position to grid bounds
  const clampedRingPos = Math.min(newRingPos, ringCount - 1);

  return {
    ringPos: clampedRingPos,
    didLand,
  };
};
