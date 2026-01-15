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
  saveModeScores,
  saveBGMVolume,
  saveSEVolume,
  saveTutorialCompleted,
  saveAchievements,
  saveModesPlayed,
  saveMaxCombo,
  type DifficultyScore,
} from '../utils/storage';
import {
  type AchievementId,
  type AchievementProgress,
  ACHIEVEMENTS,
} from '../constants/AchievementConfig';
import {
  type DifficultyLevel,
  getDifficultyConfig,
  calculateNormalizedScore,
  DEFAULT_DIFFICULTY,
} from '../constants/DifficultyConfig';
import {
  type GameMode,
  DEFAULT_GAME_MODE,
} from '../constants/GameModeConfig';

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
  isTimeMode: false,
  isEndlessMode: false,
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
  selectedMode: GameMode;
  difficultyScores: Partial<Record<DifficultyLevel, DifficultyScore>>;
  modeScores: Partial<Record<GameMode, number>>;
  bgmVolume: number;
  seVolume: number;
  tutorialCompleted: boolean;
  achievements: Partial<Record<AchievementId, AchievementProgress>>;
  modesPlayed: Set<GameMode>;
  maxCombo: number;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  loadPersistedData: () => Promise<void>;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setMode: (mode: GameMode) => void;
  setBGMVolume: (volume: number) => void;
  setSEVolume: (volume: number) => void;
  setTutorialCompleted: (completed: boolean) => void;
  checkAndUnlockAchievements: () => void;

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
  selectedMode: DEFAULT_GAME_MODE,
  difficultyScores: {},
  modeScores: {},
  bgmVolume: 0.5,
  seVolume: 0.7,
  tutorialCompleted: false,
  achievements: {},
  modesPlayed: new Set(),
  maxCombo: 0,

  // Start new game
  startGame: () => {
    const newGamesPlayed = get().gamesPlayed + 1;
    const difficulty = get().selectedDifficulty;
    const mode = get().selectedMode;
    const difficultyConfig = getDifficultyConfig(difficulty);

    // Determine mode flags
    const isTimeMode = mode === 'timeAttack';
    const isEndlessMode = mode === 'endless';

    set({
      engine: {
        ...createInitialEngineState(),
        status: 'PLAYING',
        musicStartMs: Date.now(),
        isTimeMode,
        isEndlessMode,
        // Time Attack: set initial remaining time (120 seconds = 2 minutes)
        remainingTime: isTimeMode ? 120 : undefined,
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
      const mode = state.selectedMode;
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

      // Update mode-specific high score
      const currentModeScore = state.modeScores[mode];
      const newModeScores = { ...state.modeScores };

      if (!currentModeScore || rawScore > currentModeScore) {
        newModeScores[mode] = rawScore;
        saveModeScores(newModeScores);
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
        modeScores: newModeScores,
      };
    });

    // Check and unlock achievements after game ends
    get().checkAndUnlockAchievements();
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
      modeScores: data.modeScores,
      bgmVolume: data.bgmVolume,
      seVolume: data.seVolume,
      tutorialCompleted: data.tutorialCompleted,
      achievements: data.achievements,
      modesPlayed: data.modesPlayed,
      maxCombo: data.maxCombo,
    });
  },

  // Set selected difficulty
  setDifficulty: (difficulty) => {
    set({ selectedDifficulty: difficulty });
    saveSelectedDifficulty(difficulty);
  },

  // Set selected mode
  setMode: (mode) => {
    set({ selectedMode: mode });
  },

  // Set BGM volume
  setBGMVolume: (volume) => {
    set({ bgmVolume: volume });
    saveBGMVolume(volume);
  },

  // Set SE volume
  setSEVolume: (volume) => {
    set({ seVolume: volume });
    saveSEVolume(volume);
  },

  // Set tutorial completed
  setTutorialCompleted: (completed) => {
    set({ tutorialCompleted: completed });
    saveTutorialCompleted(completed);
  },

  // Check and unlock achievements
  checkAndUnlockAchievements: () => {
    const state = get();
    const {
      engine,
      gamesPlayed,
      selectedDifficulty,
      selectedMode,
      modesPlayed,
      maxCombo,
      achievements: currentAchievements,
    } = state;

    const newAchievements = { ...currentAchievements };
    let achievementsChanged = false;

    // Helper function to unlock achievement
    const unlockAchievement = (id: AchievementId, progress: number) => {
      const achievement = ACHIEVEMENTS[id];
      const current = newAchievements[id];

      // Update progress
      if (!current || current.progress < progress) {
        newAchievements[id] = {
          unlocked: progress >= achievement.requirement,
          progress,
          unlockedAt: progress >= achievement.requirement ? Date.now() : current?.unlockedAt,
        };
        achievementsChanged = true;
      }
    };

    // Check all achievements
    const score = engine.score;
    const combo = engine.combo;

    // Update max combo if current combo is higher
    let newMaxCombo = maxCombo;
    if (combo > maxCombo) {
      newMaxCombo = combo;
      saveMaxCombo(newMaxCombo);
    }

    // Add current mode to modes played
    const newModesPlayed = new Set(modesPlayed);
    if (!newModesPlayed.has(selectedMode)) {
      newModesPlayed.add(selectedMode);
      saveModesPlayed(newModesPlayed);
    }

    // Beginner achievements
    unlockAchievement('first_game', gamesPlayed);
    unlockAchievement('games_10', gamesPlayed);
    unlockAchievement('games_50', gamesPlayed);
    unlockAchievement('games_100', gamesPlayed);

    // Score achievements
    unlockAchievement('score_1000', score >= 1000 ? score : 0);
    unlockAchievement('score_5000', score >= 5000 ? score : 0);
    unlockAchievement('score_10000', score >= 10000 ? score : 0);
    unlockAchievement('score_25000', score >= 25000 ? score : 0);
    unlockAchievement('score_50000', score >= 50000 ? score : 0);

    // Combo achievements
    unlockAchievement('combo_5', newMaxCombo >= 5 ? newMaxCombo : 0);
    unlockAchievement('combo_10', newMaxCombo >= 10 ? newMaxCombo : 0);
    unlockAchievement('combo_15', newMaxCombo >= 15 ? newMaxCombo : 0);

    // Mastery achievements
    unlockAchievement('all_modes', newModesPlayed.size);
    unlockAchievement('difficulty_7', selectedDifficulty >= 7 ? selectedDifficulty : 0);
    unlockAchievement('difficulty_10', selectedDifficulty >= 10 ? selectedDifficulty : 0);

    // Mode-specific achievements
    if (selectedMode === 'timeAttack') {
      unlockAchievement('speed_demon', score >= 3000 ? score : 0);
      unlockAchievement('time_attack_pro', score >= 5000 ? score : 0);
    }
    if (selectedMode === 'endless') {
      unlockAchievement('endless_master', score >= 10000 ? score : 0);
    }

    // Special achievement: ad-free (10 achievements unlocked)
    const unlockedCount = Object.values(newAchievements).filter(
      (a) => a.unlocked
    ).length;
    unlockAchievement('ad_free', unlockedCount);

    // Save if achievements changed
    if (achievementsChanged) {
      saveAchievements(newAchievements);
      set({
        achievements: newAchievements,
        modesPlayed: newModesPlayed,
        maxCombo: newMaxCombo,
      });
    }
  },
}));
