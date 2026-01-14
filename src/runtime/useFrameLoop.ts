/**
 * Frame loop hook for 60fps game updates
 * Uses react-native-reanimated for high-performance frame callbacks
 */

import { useEffect, useRef } from 'react';
import { useSharedValue, useFrameCallback, runOnJS } from 'react-native-reanimated';
import { useGameStore } from '../stores/useGameStore';
import { GameConfig } from '../constants/GameConfig';
import { getDifficultyConfig } from '../constants/DifficultyConfig';
import { stepFall } from '../engine/stepFall';
import { lockBlock } from '../engine/lockBlock';
import { findMatches } from '../engine/findMatches';
import { applyMatches } from '../engine/applyMatches';
import { spawn, randomColor } from '../engine/spawn';
import { getIndex } from '../utils/grid';

/**
 * Game loop hook
 * Handles block falling, landing, matching, and spawning
 */
export const useFrameLoop = () => {
  const engine = useGameStore((state) => state.engine);
  const selectedDifficulty = useGameStore((state) => state.selectedDifficulty);
  const updateEngine = useGameStore((state) => state.updateEngine);
  const setActiveBlock = useGameStore((state) => state.setActiveBlock);
  const setGrid = useGameStore((state) => state.setGrid);
  const incrementScore = useGameStore((state) => state.incrementScore);
  const setCombo = useGameStore((state) => state.setCombo);
  const endGame = useGameStore((state) => state.endGame);

  // Get difficulty configuration
  const difficultyConfig = getDifficultyConfig(selectedDifficulty);

  const lastFrameTime = useSharedValue(0);
  const isProcessing = useRef(false);

  /**
   * Handle block landing event
   */
  const handleLanding = () => {
    if (isProcessing.current) return;
    if (!engine.active) return;

    isProcessing.current = true;

    try {
      const { active, grid } = engine;

      // Calculate landing position
      const landingRing = Math.floor(active.ringPos);
      const landingIndex = getIndex(landingRing, active.sector);

      // Lock the block
      const newGrid = lockBlock({
        grid,
        index: landingIndex,
        color: active.color,
      });

      // Find matches
      const matches = findMatches(newGrid);

      let finalGrid = newGrid;
      let totalCleared = 0;
      let currentCombo = 0;

      // Apply matches (cascade)
      while (matches.length > 0) {
        const { grid: clearedGrid, clearedCount } = applyMatches(finalGrid, matches);
        finalGrid = clearedGrid;
        totalCleared += clearedCount;
        currentCombo += 1;

        // Check for new matches after gravity
        const newMatches = findMatches(finalGrid);
        if (newMatches.length === 0) break;
        matches.length = 0;
        matches.push(...newMatches);
      }

      // Calculate score
      if (totalCleared > 0) {
        const basePoints = totalCleared * GameConfig.baseScore;
        const comboBonus = Math.pow(GameConfig.comboMultiplier, currentCombo - 1);
        const points = Math.floor(basePoints * comboBonus);
        incrementScore(points);
        setCombo(currentCombo);
      } else {
        setCombo(0);
      }

      // Update grid
      setGrid(finalGrid);

      // Spawn next block
      try {
        const nextColor = randomColor(difficultyConfig.colorCount);
        const spawnResult = spawn({
          grid: finalGrid,
          nextColor: engine.nextColor,
          sectorCount: GameConfig.sectorCount,
        });

        setActiveBlock({
          id: `block-${Date.now()}`,
          color: spawnResult.color,
          sector: spawnResult.sector,
          ringPos: 0,
          velocity: difficultyConfig.initialVelocity,
        });

        updateEngine({ nextColor });
      } catch (error) {
        // Game Over - no free spawn position
        console.log('Game Over: No spawn position available');
        endGame();
        setActiveBlock(null);
      }
    } catch (error) {
      console.error('Error handling landing:', error);
      // Try to recover by spawning a new block
      try {
        const nextColor = randomColor(difficultyConfig.colorCount);
        setActiveBlock({
          id: `block-${Date.now()}`,
          color: nextColor,
          sector: 0,
          ringPos: 0,
          velocity: difficultyConfig.initialVelocity,
        });
      } catch {
        endGame();
      }
    } finally {
      isProcessing.current = false;
    }
  };

  useFrameCallback((frameInfo) => {
    'worklet';

    // Skip if not playing
    if (engine.status !== 'PLAYING') {
      lastFrameTime.value = frameInfo.timestamp;
      return;
    }

    // Calculate delta time (in seconds)
    const deltaMs = lastFrameTime.value === 0 ? 16 : frameInfo.timestamp - lastFrameTime.value;
    const deltaSeconds = deltaMs / 1000;
    lastFrameTime.value = frameInfo.timestamp;

    // Skip if no active block
    if (!engine.active) {
      return;
    }

    // Update falling block position
    const fallResult = stepFall(
      {
        ringPos: engine.active.ringPos,
        velocity: engine.active.velocity,
      },
      deltaSeconds,
      GameConfig.ringCount
    );

    // Update active block position (on UI thread)
    if (fallResult.didLand) {
      // Landing event - run on JS thread
      runOnJS(handleLanding)();
    } else {
      // Just update position
      const updatedBlock = {
        ...engine.active,
        ringPos: fallResult.ringPos,
      };
      runOnJS(setActiveBlock)(updatedBlock);
    }
  });
};
