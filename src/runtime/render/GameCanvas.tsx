/**
 * Main game canvas using Skia
 * Central coordinate system and rendering entry point
 */

import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { CoreRenderer } from './CoreRenderer';
import { BlockRenderer } from './BlockRenderer';
import { EffectLayer } from './EffectLayer';
import { useGameStore } from '../../stores/useGameStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Canvas dimensions and center point
 */
export const CANVAS_WIDTH = SCREEN_WIDTH;
export const CANVAS_HEIGHT = SCREEN_HEIGHT * 0.7; // Reserve 30% for HUD
export const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
export const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;

type GameCanvasProps = {
  debug?: boolean;
  particles?: any[]; // Particle array passed from parent
};

/**
 * Main game canvas component
 */
export const GameCanvas: React.FC<GameCanvasProps> = ({
  debug = false,
  particles = []
}) => {
  const engine = useGameStore((state) => state.engine);

  return (
    <Canvas style={styles.canvas}>
      {/* Core and rings */}
      <CoreRenderer
        centerX={CANVAS_CENTER_X}
        centerY={CANVAS_CENTER_Y}
        debug={debug}
      />

      {/* Blocks (grid + active) */}
      <BlockRenderer
        centerX={CANVAS_CENTER_X}
        centerY={CANVAS_CENTER_Y}
        grid={engine.grid}
        activeBlock={engine.active}
      />

      {/* Effect layer (particles, animations) */}
      <EffectLayer
        centerX={CANVAS_CENTER_X}
        centerY={CANVAS_CENTER_Y}
        particles={particles}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#0a0a0a', // Dark background
  },
});
