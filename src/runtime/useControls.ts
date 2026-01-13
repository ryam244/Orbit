/**
 * Input control hook
 * Handles touch/tap controls for block rotation and fast drop
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { GameConfig } from '../constants/GameConfig';
import { wrapSector } from '../utils/grid';

/**
 * Control actions
 */
export type ControlAction = 'rotate-left' | 'rotate-right' | 'fast-drop' | 'instant-drop';

/**
 * Controls hook
 * Returns action handlers for game controls
 */
export const useControls = () => {
  const engine = useGameStore((state) => state.engine);
  const setActiveBlock = useGameStore((state) => state.setActiveBlock);

  /**
   * Rotate active block left (counter-clockwise)
   */
  const rotateLeft = useCallback(() => {
    if (!engine.active) return;
    if (engine.status !== 'PLAYING') return;

    const newSector = wrapSector(engine.active.sector - 1);
    setActiveBlock({
      ...engine.active,
      sector: newSector,
    });
  }, [engine.active, engine.status, setActiveBlock]);

  /**
   * Rotate active block right (clockwise)
   */
  const rotateRight = useCallback(() => {
    if (!engine.active) return;
    if (engine.status !== 'PLAYING') return;

    const newSector = wrapSector(engine.active.sector + 1);
    setActiveBlock({
      ...engine.active,
      sector: newSector,
    });
  }, [engine.active, engine.status, setActiveBlock]);

  /**
   * Enable fast drop (increases velocity)
   */
  const fastDrop = useCallback(() => {
    if (!engine.active) return;
    if (engine.status !== 'PLAYING') return;

    setActiveBlock({
      ...engine.active,
      velocity: GameConfig.initialVelocity * GameConfig.fastDropMultiplier,
    });
  }, [engine.active, engine.status, setActiveBlock]);

  /**
   * Disable fast drop (resets to normal velocity)
   */
  const normalDrop = useCallback(() => {
    if (!engine.active) return;
    if (engine.status !== 'PLAYING') return;

    setActiveBlock({
      ...engine.active,
      velocity: GameConfig.initialVelocity,
    });
  }, [engine.active, engine.status, setActiveBlock]);

  /**
   * Instant drop (teleport to bottom)
   */
  const instantDrop = useCallback(() => {
    if (!engine.active) return;
    if (engine.status !== 'PLAYING') return;

    // Set position to landing ring
    setActiveBlock({
      ...engine.active,
      ringPos: GameConfig.ringCount - 1,
    });
  }, [engine.active, engine.status, setActiveBlock]);

  return {
    rotateLeft,
    rotateRight,
    fastDrop,
    normalDrop,
    instantDrop,
  };
};
