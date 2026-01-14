/**
 * Global game state management using Zustand
 * Handles engine state, scores, and game flow
 */

import { create } from 'zustand';
import { GameConfig } from '../constants/GameConfig';
import type { EngineState, ActiveBlock } from '../engine/types';
import { randomColor } from '../engine/spawn';
import {
  loadPersistedData,
  saveHighScore,
  saveGamesPlayed,
  saveSelectedDifficulty,
  saveDifficultyScores,
  type DifficultyScore,
} from '../utils/storage';
import {
  type DifficultyLevel,
  getDifficultyConfig,
  calculateNormalizedScore,
  DEFAULT_DIFFICULTY,
} from '../constants/DifficultyConfig';

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
  highScore: number; // Legacy - overall high score
  gamesPlayed: number;
  selectedDifficulty: DifficultyLevel;
  difficultyScores: Partial<Record<DifficultyLevel, DifficultyScore>>;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  loadPersistedData: () => Promise<void>;
  setDifficulty: (difficulty: DifficultyLevel) => void;

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
  selectedDifficulty: DEFAULT_DIFFICULTY,
  difficultyScores: {},

  // Start new game
  startGame: () => {
    const newGamesPlayed = get().gamesPlayed + 1;
    const difficulty = get().selectedDifficulty;
    const difficultyConfig = getDifficultyConfig(difficulty);

    set({
      engine: {
        ...createInitialEngineState(),
        status: 'PLAYING',
        musicStartMs: Date.now(),
        // Note: Initial velocity will be set when first block spawns
        // ColorCount will be used in spawn function via difficulty config
      },
      gamesPlayed: newGamesPlayed,
    });
    // Save games played count
    saveGamesPlayed(newGamesPlayed);
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
      const rawScore = state.engine.score;
      const difficulty = state.selectedDifficulty;
      const normalizedScore = calculateNormalizedScore(rawScore, difficulty);

      // Update legacy high score
      const newHighScore = Math.max(state.highScore, rawScore);
      const highScoreChanged = newHighScore > state.highScore;

      // Update difficulty-specific high score
      const currentDifficultyScore = state.difficultyScores[difficulty];
      const newDifficultyScores = { ...state.difficultyScores };

      if (
        !currentDifficultyScore ||
        normalizedScore > currentDifficultyScore.normalizedScore
      ) {
        newDifficultyScores[difficulty] = {
          rawScore,
          normalizedScore,
        };
        saveDifficultyScores(newDifficultyScores);
      }

      // Save legacy high score if it changed
      if (highScoreChanged) {
        saveHighScore(newHighScore);
      }

      return {
        engine: {
          ...state.engine,
          status: 'GAME_OVER',
        },
        highScore: newHighScore,
        difficultyScores: newDifficultyScores,
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

  // Load persisted data from AsyncStorage
  loadPersistedData: async () => {
    const data = await loadPersistedData();
    set({
      highScore: data.highScore,
      gamesPlayed: data.gamesPlayed,
      selectedDifficulty: data.selectedDifficulty,
      difficultyScores: data.difficultyScores,
    });
  },

  // Set selected difficulty
  setDifficulty: (difficulty) => {
    set({ selectedDifficulty: difficulty });
    saveSelectedDifficulty(difficulty);
  },
}));
