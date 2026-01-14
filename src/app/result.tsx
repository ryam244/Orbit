/**
 * Result screen
 * Shows game results with score count-up animation
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../stores/useGameStore';

export default function ResultScreen() {
  const router = useRouter();
  const engine = useGameStore((state) => state.engine);
  const highScore = useGameStore((state) => state.highScore);
  const resetGame = useGameStore((state) => state.resetGame);

  const [displayScore, setDisplayScore] = useState(0);
  const [showNewRecord, setShowNewRecord] = useState(false);

  const finalScore = engine.score;
  const maxCombo = engine.combo;
  const isNewRecord = finalScore > 0 && finalScore >= highScore;

  // Score count-up animation
  useEffect(() => {
    if (finalScore === 0) {
      setDisplayScore(0);
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = finalScore / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        setDisplayScore(finalScore);
        clearInterval(interval);

        // Show new record after count-up
        if (isNewRecord) {
          setTimeout(() => setShowNewRecord(true), 300);
        }
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [finalScore, isNewRecord]);

  const handleRetry = () => {
    resetGame();
    router.replace('/game');
  };

  const handleBackToTitle = () => {
    resetGame();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.glowCenter} />

      {/* Title */}
      <Text style={styles.title}>GAME OVER</Text>

      {/* Score card */}
      <View style={styles.scoreCard}>
        {/* New record badge */}
        {showNewRecord && (
          <View style={styles.recordBadge}>
            <Text style={styles.recordText}>★ NEW RECORD ★</Text>
          </View>
        )}

        {/* Final score */}
        <Text style={styles.scoreLabel}>FINAL SCORE</Text>
        <Text style={styles.scoreValue}>{displayScore.toLocaleString()}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>MAX COMBO</Text>
            <Text style={styles.statValue}>x{maxCombo}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>HIGH SCORE</Text>
            <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonStack}>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>▶ RETRY</Text>
        </Pressable>

        <Pressable style={styles.titleButton} onPress={handleBackToTitle}>
          <Text style={styles.titleText}>← BACK TO TITLE</Text>
        </Pressable>
      </View>
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
  glowCenter: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#00ffff',
    opacity: 0.05,
    blur: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ff0000',
    letterSpacing: 4,
    marginBottom: 40,
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  recordBadge: {
    position: 'absolute',
    top: -15,
    backgroundColor: '#ffff00',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  recordText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 3,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    color: '#00ffff',
    marginBottom: 32,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 2,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  buttonStack: {
    width: '100%',
    gap: 16,
  },
  retryButton: {
    backgroundColor: '#00ffff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  retryText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  titleButton: {
    borderWidth: 2,
    borderColor: '#666',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  titleText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
