/**
 * Main game screen
 * Integrates all game components: canvas, controls, HUD
 */

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useGameStore } from '../stores/useGameStore';
import { useFrameLoop } from '../runtime/useFrameLoop';
import { useControls } from '../runtime/useControls';
import { GameCanvas } from '../runtime/render/GameCanvas';

export default function GameScreen() {
  const router = useRouter();
  const engine = useGameStore((state) => state.engine);
  const startGame = useGameStore((state) => state.startGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);

  const { rotateLeft, rotateRight, fastDrop, normalDrop } = useControls();

  // Initialize frame loop
  useFrameLoop();

  // Auto-start game on mount
  useEffect(() => {
    if (engine.status === 'IDLE') {
      startGame();
    }
  }, []);

  // Navigate to result screen on game over
  useEffect(() => {
    if (engine.status === 'GAME_OVER') {
      const timer = setTimeout(() => {
        router.push('/result');
      }, 2000); // 2 second delay to show final state

      return () => clearTimeout(timer);
    }
  }, [engine.status, router]);

  /**
   * Gesture handlers for touch controls
   */
  // Tap left side = rotate left
  const tapLeftGesture = Gesture.Tap()
    .onEnd(() => {
      rotateLeft();
    })
    .runOnJS(true);

  // Tap right side = rotate right
  const tapRightGesture = Gesture.Tap()
    .onEnd(() => {
      rotateRight();
    })
    .runOnJS(true);

  // Long press = fast drop
  const longPressGesture = Gesture.LongPress()
    .minDuration(100)
    .onStart(() => {
      fastDrop();
    })
    .onEnd(() => {
      normalDrop();
    })
    .runOnJS(true);

  /**
   * Handle pause toggle
   */
  const handlePause = () => {
    if (engine.status === 'PLAYING') {
      pauseGame();
    } else if (engine.status === 'PAUSED') {
      resumeGame();
    }
  };

  return (
    <View style={styles.container}>
      {/* Game Canvas */}
      <GameCanvas debug={false} />

      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudRow}>
          <Text style={styles.hudLabel}>Score</Text>
          <Text style={styles.hudValue}>{engine.score}</Text>
        </View>
        <View style={styles.hudRow}>
          <Text style={styles.hudLabel}>Combo</Text>
          <Text style={styles.hudValue}>
            {engine.combo > 0 ? `x${engine.combo}` : '-'}
          </Text>
        </View>
      </View>

      {/* Control Areas */}
      <View style={styles.controlsContainer}>
        {/* Left control area */}
        <GestureDetector gesture={Gesture.Race(longPressGesture, tapLeftGesture)}>
          <Pressable style={styles.controlLeft}>
            <Text style={styles.controlText}>◀</Text>
          </Pressable>
        </GestureDetector>

        {/* Right control area */}
        <GestureDetector gesture={Gesture.Race(longPressGesture, tapRightGesture)}>
          <Pressable style={styles.controlRight}>
            <Text style={styles.controlText}>▶</Text>
          </Pressable>
        </GestureDetector>
      </View>

      {/* Pause Button */}
      <Pressable style={styles.pauseButton} onPress={handlePause}>
        <Text style={styles.pauseText}>
          {engine.status === 'PAUSED' ? '▶' : '❚❚'}
        </Text>
      </Pressable>

      {/* Game Over Overlay */}
      {engine.status === 'GAME_OVER' && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.gameOverScore}>Score: {engine.score}</Text>
        </View>
      )}

      {/* Pause Overlay */}
      {engine.status === 'PAUSED' && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pausedText}>PAUSED</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  hud: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudRow: {
    alignItems: 'center',
  },
  hudLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  hudValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ffff',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    flexDirection: 'row',
  },
  controlLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 255, 0.3)',
  },
  controlRight: {
    flex: 1,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 0, 255, 0.3)',
  },
  controlText: {
    fontSize: 48,
    color: '#fff',
    opacity: 0.5,
  },
  pauseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pauseText: {
    fontSize: 20,
    color: '#fff',
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ff0000',
    marginBottom: 20,
  },
  gameOverScore: {
    fontSize: 24,
    color: '#00ffff',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pausedText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffff00',
  },
});
