/**
 * Local storage utilities using AsyncStorage
 * Handles save/load of persistent game data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  HIGH_SCORE: '@orbit:highScore',
  GAMES_PLAYED: '@orbit:gamesPlayed',
} as const;

/**
 * Persistent data structure
 */
export type PersistedData = {
  highScore: number;
  gamesPlayed: number;
};

/**
 * Load persisted data from AsyncStorage
 */
export const loadPersistedData = async (): Promise<PersistedData> => {
  try {
    const [highScoreStr, gamesPlayedStr] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
      AsyncStorage.getItem(STORAGE_KEYS.GAMES_PLAYED),
    ]);

    return {
      highScore: highScoreStr ? parseInt(highScoreStr, 10) : 0,
      gamesPlayed: gamesPlayedStr ? parseInt(gamesPlayedStr, 10) : 0,
    };
  } catch (error) {
    console.error('Failed to load persisted data:', error);
    return {
      highScore: 0,
      gamesPlayed: 0,
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
 * Save all persistent data at once
 */
export const saveAllData = async (data: PersistedData): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(data.highScore)),
      AsyncStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, String(data.gamesPlayed)),
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
