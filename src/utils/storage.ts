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
  BGM_VOLUME: '@orbit:bgmVolume',
  SE_VOLUME: '@orbit:seVolume',
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
  bgmVolume: number; // 0.0 - 1.0
  seVolume: number; // 0.0 - 1.0
};

/**
 * Load persisted data from AsyncStorage
 */
export const loadPersistedData = async (): Promise<PersistedData> => {
  try {
    const [
      highScoreStr,
      gamesPlayedStr,
      selectedDifficultyStr,
      difficultyScoresStr,
      bgmVolumeStr,
      seVolumeStr,
    ] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
      AsyncStorage.getItem(STORAGE_KEYS.GAMES_PLAYED),
      AsyncStorage.getItem(STORAGE_KEYS.SELECTED_DIFFICULTY),
      AsyncStorage.getItem(STORAGE_KEYS.DIFFICULTY_SCORES),
      AsyncStorage.getItem(STORAGE_KEYS.BGM_VOLUME),
      AsyncStorage.getItem(STORAGE_KEYS.SE_VOLUME),
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
      bgmVolume: bgmVolumeStr ? parseFloat(bgmVolumeStr) : 0.5,
      seVolume: seVolumeStr ? parseFloat(seVolumeStr) : 0.7,
    };
  } catch (error) {
    console.error('Failed to load persisted data:', error);
    return {
      highScore: 0,
      gamesPlayed: 0,
      selectedDifficulty: 4,
      difficultyScores: {},
      bgmVolume: 0.5,
      seVolume: 0.7,
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
 * Save BGM volume to AsyncStorage
 */
export const saveBGMVolume = async (volume: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BGM_VOLUME, String(volume));
  } catch (error) {
    console.error('Failed to save BGM volume:', error);
  }
};

/**
 * Save SE volume to AsyncStorage
 */
export const saveSEVolume = async (volume: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SE_VOLUME, String(volume));
  } catch (error) {
    console.error('Failed to save SE volume:', error);
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
      AsyncStorage.setItem(STORAGE_KEYS.BGM_VOLUME, String(data.bgmVolume)),
      AsyncStorage.setItem(STORAGE_KEYS.SE_VOLUME, String(data.seVolume)),
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
