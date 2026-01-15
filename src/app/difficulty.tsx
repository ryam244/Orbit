/**
 * Difficulty selection screen
 * Allows player to choose difficulty level (1-10)
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../stores/useGameStore';
import {
  type DifficultyLevel,
  DIFFICULTY_CONFIGS,
} from '../constants/DifficultyConfig';

export default function DifficultyScreen() {
  const router = useRouter();
  const selectedDifficulty = useGameStore((state) => state.selectedDifficulty);
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  const difficultyScores = useGameStore((state) => state.difficultyScores);

  const handleSelectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SELECT DIFFICULTY</Text>
        <Text style={styles.subtitle}>Choose your challenge level</Text>
      </View>

      {/* Difficulty list */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
        {(Object.keys(DIFFICULTY_CONFIGS) as unknown as DifficultyLevel[]).map(
          (level) => {
            const config = DIFFICULTY_CONFIGS[level];
            const score = difficultyScores[level];
            const isSelected = level === selectedDifficulty;

            return (
              <Pressable
                key={level}
                style={[
                  styles.difficultyCard,
                  isSelected && styles.difficultyCardSelected,
                ]}
                onPress={() => handleSelectDifficulty(level)}
              >
                {/* Level badge */}
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{level}</Text>
                </View>

                {/* Info section */}
                <View style={styles.infoSection}>
                  <Text style={styles.difficultyName}>{config.name}</Text>
                  <Text style={styles.difficultyDesc}>{config.description}</Text>

                  {/* Stats */}
                  <View style={styles.statsRow}>
                    <Text style={styles.statText}>
                      Speed: {config.initialVelocity.toFixed(1)}
                    </Text>
                    <Text style={styles.statText}>Colors: {config.colorCount}</Text>
                    <Text style={styles.statText}>
                      Mult: ×{config.scoreMultiplier.toFixed(1)}
                    </Text>
                  </View>

                  {/* High score */}
                  {score && (
                    <Text style={styles.highScoreText}>
                      Best: {score.normalizedScore.toLocaleString()} (
                      {score.rawScore.toLocaleString()})
                    </Text>
                  )}
                </View>

                {/* Selected indicator */}
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedText}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          }
        )}
      </ScrollView>

      {/* Back button */}
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← BACK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00ffff',
    letterSpacing: 3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  difficultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  difficultyCardSelected: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderColor: '#00ffff',
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00ffff',
  },
  infoSection: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  difficultyDesc: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  highScoreText: {
    fontSize: 11,
    color: '#00ffff',
    marginTop: 4,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 2,
  },
});
