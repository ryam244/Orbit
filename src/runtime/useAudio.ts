/**
 * Audio management hook using expo-av
 * Handles BGM and sound effects for game events
 */

import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

/**
 * Sound effect types
 */
export type SoundType =
  | 'match' // マッチ成功
  | 'rotate' // ブロック回転
  | 'drop' // 高速ドロップ
  | 'land' // ブロック着地
  | 'combo' // コンボ
  | 'gameOver'; // ゲームオーバー

/**
 * Audio hook for managing game sounds
 */
export const useAudio = (bgmVolume: number = 0.5, seVolume: number = 0.7) => {
  const soundsRef = useRef<Map<SoundType, Audio.Sound>>(new Map());
  const bgmRef = useRef<Audio.Sound | null>(null);
  const seVolumeRef = useRef(seVolume);

  // Update SE volume ref when it changes
  useEffect(() => {
    seVolumeRef.current = seVolume;
  }, [seVolume]);

  // Initialize audio mode on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    return () => {
      // Cleanup all sounds on unmount
      soundsRef.current.forEach((sound) => {
        sound.unloadAsync();
      });
      if (bgmRef.current) {
        bgmRef.current.unloadAsync();
      }
    };
  }, []);

  /**
   * Play a sound effect
   * Uses simple synthesized sounds for now
   */
  const playSound = async (type: SoundType) => {
    try {
      // Skip if volume is 0
      if (seVolumeRef.current === 0) return;

      // For now, we'll use a simple beep sound
      // In production, load actual sound files from assets
      const { sound } = await Audio.Sound.createAsync(
        // Using expo-av's built-in sound for now
        // TODO: Replace with actual sound files
        { uri: generateSoundUri(type) },
        { shouldPlay: true, volume: seVolumeRef.current },
        null,
        false
      );

      // Cleanup after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      // Silently fail - audio is not critical
      console.warn(`Failed to play sound: ${type}`, error);
    }
  };

  /**
   * Play background music (looped)
   */
  const playBGM = async (volume: number = 0.3) => {
    try {
      if (bgmRef.current) {
        await bgmRef.current.playAsync();
        return;
      }

      // TODO: Load actual BGM file
      // For now, skip BGM playback
      console.log('BGM playback (placeholder)');
    } catch (error) {
      console.warn('Failed to play BGM', error);
    }
  };

  /**
   * Stop background music
   */
  const stopBGM = async () => {
    try {
      if (bgmRef.current) {
        await bgmRef.current.stopAsync();
      }
    } catch (error) {
      console.warn('Failed to stop BGM', error);
    }
  };

  /**
   * Set BGM volume
   */
  const setBGMVolume = async (volume: number) => {
    try {
      if (bgmRef.current) {
        await bgmRef.current.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      }
    } catch (error) {
      console.warn('Failed to set BGM volume', error);
    }
  };

  return {
    playSound,
    playBGM,
    stopBGM,
    setBGMVolume,
  };
};

/**
 * Generate a simple sound URI based on type
 * TODO: Replace with actual sound file paths
 */
function generateSoundUri(type: SoundType): string {
  // Placeholder - in production, return actual asset URIs like:
  // return require('../../assets/sounds/match.mp3');

  // For now, return a data URI with silence (won't actually play)
  return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
}

/**
 * Preload sound effects
 * Call this during app initialization for better performance
 */
export const preloadSounds = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // TODO: Preload actual sound files
    console.log('Sound preload complete (placeholder)');
  } catch (error) {
    console.warn('Failed to preload sounds', error);
  }
};
