/**
 * Global game state management using Zustand
 * Handles engine state, scores, and game flow
 */

import { create } from 'zustand';
import { GameConfig } from '../constants/GameConfig';
import type { EngineState, ActiveBlock } from '../engine/types';
import { randomColor } from '../engine/spawn';

/**
 * Create initial empty grid
 */
const createEmptyGrid = (): Uint8Array => {
  return new Uint8Array(GameConfig.ringCount * GameConfig.sectorCount);
};

/**
 * Create initial engine state
 */
const createInitialEngineState = (): EngineState => ({
  status: 'IDLE',
  score: 0,
  combo: 0,
  gravityGauge: 0,
  coreSectorOffset: 0,
  grid: createEmptyGrid(),
  active: null,
  nextColor: randomColor(GameConfig.colorCount),
  bpm: GameConfig.defaultBpm,
  musicStartMs: 0,
});

/**
 * Game store state
 */
type GameStore = {
  // Engine state
  engine: EngineState;

  // Persistent data
  highScore: number;
  gamesPlayed: number;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Engine updates
  updateEngine: (updates: Partial<EngineState>) => void;
  setActiveBlock: (block: ActiveBlock | null) => void;
  setGrid: (grid: Uint8Array) => void;
  incrementScore: (points: number) => void;
  setCombo: (combo: number) => void;
};

/**
 * Zustand game store
 */
export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  engine: createInitialEngineState(),
  highScore: 0,
  gamesPlayed: 0,

  // Start new game
  startGame: () => {
    set({
      engine: {
        ...createInitialEngineState(),
        status: 'PLAYING',
        musicStartMs: Date.now(),
      },
      gamesPlayed: get().gamesPlayed + 1,
    });
  },

  // Pause game
  pauseGame: () => {
    set((state) => ({
      engine: {
        ...state.engine,
        status: 'PAUSED',
      },
    }));
  },

  // Resume game
  resumeGame: () => {
    set((state) => ({
      engine: {
        ...state.engine,
        status: 'PLAYING',
      },
    }));
  },

  // End game
  endGame: () => {
    set((state) => {
      const newHighScore = Math.max(state.highScore, state.engine.score);
      return {
        engine: {
          ...state.engine,
          status: 'GAME_OVER',
        },
        highScore: newHighScore,
      };
    });
  },

  // Reset to initial state
  resetGame: () => {
    set({
      engine: createInitialEngineState(),
    });
  },

  // Update engine state
  updateEngine: (updates) => {
    set((state) => ({
      engine: {
        ...state.engine,
        ...updates,
      },
    }));
  },

  // Set active block
  setActiveBlock: (block) => {
    set((state) => ({
      engine: {
        ...state.engine,
        active: block,
      },
    }));
  },

  // Set grid
  setGrid: (grid) => {
    set((state) => ({
      engine: {
        ...state.engine,
        grid,
      },
    }));
  },

  // Increment score
  incrementScore: (points) => {
    set((state) => ({
      engine: {
        ...state.engine,
        score: state.engine.score + points,
      },
    }));
  },

  // Set combo
  setCombo: (combo) => {
    set((state) => ({
      engine: {
        ...state.engine,
        combo,
      },
    }));
  },
}));
