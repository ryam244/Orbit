/**
 * Game mode selection screen
 * Allows player to choose game mode
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../stores/useGameStore';
import {
  type GameMode,
  GAME_MODE_CONFIGS,
} from '../constants/GameModeConfig';

export default function ModeScreen() {
  const router = useRouter();
  const selectedMode = useGameStore((state) => state.selectedMode);
  const setMode = useGameStore((state) => state.setMode);

  const handleSelectMode = (mode: GameMode) => {
    setMode(mode);
  };

  const handleBack = () => {
    router.back();
  };

  const handleStartGame = () => {
    router.push('/game');
  };

  const modes: GameMode[] = ['standard', 'timeAttack', 'endless', 'puzzle'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SELECT MODE</Text>
        <Text style={styles.subtitle}>ゲームモードを選択</Text>
      </View>

      {/* Mode list */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
        {modes.map((mode) => {
          const config = GAME_MODE_CONFIGS[mode];
          const isSelected = mode === selectedMode;

          return (
            <Pressable
              key={mode}
              style={[
                styles.modeCard,
                isSelected && styles.modeCardSelected,
              ]}
              onPress={() => handleSelectMode(mode)}
            >
              {/* Icon */}
              <Text style={styles.modeIcon}>{config.icon}</Text>

              {/* Info section */}
              <View style={styles.infoSection}>
                <Text style={styles.modeName}>{config.name}</Text>
                <Text style={styles.modeDesc}>{config.description}</Text>

                {/* Rules */}
                <View style={styles.rulesContainer}>
                  {config.rules.map((rule, index) => (
                    <Text key={index} style={styles.ruleText}>
                      • {rule}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Selected indicator */}
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startText}>▶ START GAME</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
      </View>
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
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modeCardSelected: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderColor: '#00ffff',
  },
  modeIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  infoSection: {
    flex: 1,
  },
  modeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  modeDesc: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  rulesContainer: {
    gap: 4,
  },
  ruleText: {
    fontSize: 11,
    color: '#666',
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
  buttonContainer: {
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButton: {
    backgroundColor: '#00ffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 2,
  },
});
