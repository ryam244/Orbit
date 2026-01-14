/**
 * Title screen
 * Main menu with cyberpunk theme
 */

import React, { useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../stores/useGameStore';
import { getDifficultyConfig } from '../constants/DifficultyConfig';
import { getGameModeConfig } from '../constants/GameModeConfig';

export default function TitleScreen() {
  const router = useRouter();
  const highScore = useGameStore((state) => state.highScore);
  const gamesPlayed = useGameStore((state) => state.gamesPlayed);
  const selectedDifficulty = useGameStore((state) => state.selectedDifficulty);
  const selectedMode = useGameStore((state) => state.selectedMode);
  const tutorialCompleted = useGameStore((state) => state.tutorialCompleted);

  const difficultyConfig = getDifficultyConfig(selectedDifficulty);
  const modeConfig = getGameModeConfig(selectedMode);

  // Auto-navigate to tutorial on first launch
  useEffect(() => {
    if (!tutorialCompleted) {
      router.replace('/tutorial');
    }
  }, [tutorialCompleted, router]);

  return (
    <View style={styles.container}>
      {/* Background glow effects */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Title section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>ORBIT</Text>
        <Text style={styles.titleGlow}>ORBIT</Text>
        <Text style={styles.subtitle}>◈ NEON RING PUZZLE ◈</Text>
      </View>

      {/* Stats section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>HIGH SCORE</Text>
          <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>GAMES PLAYED</Text>
          <Text style={styles.statValue}>{gamesPlayed}</Text>
        </View>
      </View>

      {/* Button section */}
      <View style={styles.buttonStack}>
        <Link href="/mode" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>
              {modeConfig.icon} {modeConfig.name.toUpperCase()}
            </Text>
            <View style={styles.buttonGlow} />
          </Pressable>
        </Link>

        <Link href="/difficulty" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>
              ⚙ DIFFICULTY: {difficultyConfig.name.toUpperCase()}
            </Text>
          </Pressable>
        </Link>

        <Link href="/result" asChild>
          <Pressable style={styles.tertiaryButton}>
            <Text style={styles.tertiaryText}>📊 STATISTICS</Text>
          </Pressable>
        </Link>

        <Link href="/tutorial" asChild>
          <Pressable style={styles.tertiaryButton}>
            <Text style={styles.tertiaryText}>❓ HOW TO PLAY</Text>
          </Pressable>
        </Link>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Match 3+ blocks • Tap to rotate • Hold to drop</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 32,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00ffff',
    opacity: 0.1,
    blur: 50,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#ff00ff',
    opacity: 0.1,
    blur: 50,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 72,
    fontWeight: '900',
    color: '#00ffff',
    letterSpacing: 8,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  titleGlow: {
    position: 'absolute',
    fontSize: 72,
    fontWeight: '900',
    color: '#00ffff',
    letterSpacing: 8,
    opacity: 0.3,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#ff00ff',
    letterSpacing: 4,
    marginTop: 8,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 60,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 2,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ffff',
  },
  buttonStack: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#00ffff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00ffff',
    opacity: 0.2,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#ff00ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 255, 0.05)',
  },
  secondaryText: {
    color: '#ff00ff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tertiaryButton: {
    borderWidth: 2,
    borderColor: '#666',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tertiaryText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  footer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
