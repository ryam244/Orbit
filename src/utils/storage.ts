/**
 * Local storage utilities using AsyncStorage
 * Handles save/load of persistent game data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DifficultyLevel } from '../constants/DifficultyConfig';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  HIGH_SCORE: '@orbit:highScore', // Legacy - kept for backward compatibility
  GAMES_PLAYED: '@orbit:gamesPlayed',
  SELECTED_DIFFICULTY: '@orbit:selectedDifficulty',
  DIFFICULTY_SCORES: '@orbit:difficultyScores', // High scores per difficulty
} as const;

/**
 * High score record for a difficulty level
 */
export type DifficultyScore = {
  rawScore: number;
  normalizedScore: number;
};

/**
 * Persistent data structure
 */
export type PersistedData = {
  highScore: number; // Legacy - overall high score (raw)
  gamesPlayed: number;
  selectedDifficulty: DifficultyLevel;
  difficultyScores: Partial<Record<DifficultyLevel, DifficultyScore>>;
};

/**
 * Load persisted data from AsyncStorage
 */
export const loadPersistedData = async (): Promise<PersistedData> => {
  try {
    const [highScoreStr, gamesPlayedStr, selectedDifficultyStr, difficultyScoresStr] =
      await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.GAMES_PLAYED),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_DIFFICULTY),
        AsyncStorage.getItem(STORAGE_KEYS.DIFFICULTY_SCORES),
      ]);

    const difficultyScores = difficultyScoresStr
      ? JSON.parse(difficultyScoresStr)
      : {};

    return {
      highScore: highScoreStr ? parseInt(highScoreStr, 10) : 0,
      gamesPlayed: gamesPlayedStr ? parseInt(gamesPlayedStr, 10) : 0,
      selectedDifficulty: selectedDifficultyStr
        ? (parseInt(selectedDifficultyStr, 10) as DifficultyLevel)
        : 4, // Default to Normal
      difficultyScores,
    };
  } catch (error) {
    console.error('Failed to load persisted data:', error);
    return {
      highScore: 0,
      gamesPlayed: 0,
      selectedDifficulty: 4,
      difficultyScores: {},
    };
  }
};

/**
 * Save high score to AsyncStorage
 */
export const saveHighScore = async (highScore: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(highScore));
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
};

/**
 * Save games played count to AsyncStorage
 */
export const saveGamesPlayed = async (gamesPlayed: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, String(gamesPlayed));
  } catch (error) {
    console.error('Failed to save games played:', error);
  }
};

/**
 * Save selected difficulty to AsyncStorage
 */
export const saveSelectedDifficulty = async (
  difficulty: DifficultyLevel
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_DIFFICULTY, String(difficulty));
  } catch (error) {
    console.error('Failed to save selected difficulty:', error);
  }
};

/**
 * Save difficulty scores to AsyncStorage
 */
export const saveDifficultyScores = async (
  scores: Partial<Record<DifficultyLevel, DifficultyScore>>
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.DIFFICULTY_SCORES,
      JSON.stringify(scores)
    );
  } catch (error) {
    console.error('Failed to save difficulty scores:', error);
  }
};

/**
 * Save all persistent data at once
 */
export const saveAllData = async (data: PersistedData): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(data.highScore)),
      AsyncStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, String(data.gamesPlayed)),
      AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_DIFFICULTY,
        String(data.selectedDifficulty)
      ),
      AsyncStorage.setItem(
        STORAGE_KEYS.DIFFICULTY_SCORES,
        JSON.stringify(data.difficultyScores)
      ),
    ]);
  } catch (error) {
    console.error('Failed to save all data:', error);
  }
};

/**
 * Clear all persisted data (for debugging/reset)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HIGH_SCORE,
      STORAGE_KEYS.GAMES_PLAYED,
    ]);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
};
