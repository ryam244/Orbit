/**
 * Effect layer for visual effects
 * Particles, animations, and visual feedback
 */

import React from 'react';
import { Circle, Group } from '@shopify/react-native-skia';

export type Particle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
};

type EffectLayerProps = {
  centerX: number;
  centerY: number;
  particles: Particle[];
};

/**
 * Renders visual effects like particles
 */
export const EffectLayer: React.FC<EffectLayerProps> = ({
  centerX,
  centerY,
  particles,
}) => {
  return (
    <Group>
      {/* Render particles */}
      {particles.map((particle) => {
        const alpha = particle.life / particle.maxLife;
        return (
          <Circle
            key={particle.id}
            cx={centerX + particle.x}
            cy={centerY + particle.y}
            r={particle.size}
            color={particle.color}
            opacity={alpha * 0.8}
          />
        );
      })}
    </Group>
  );
};

/**
 * Create particle burst at a position
 */
export const createParticleBurst = (
  x: number,
  y: number,
  color: string,
  count: number = 8
): Particle[] => {
  const particles: Particle[] = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = angleStep * i;
    const speed = 50 + Math.random() * 50; // 50-100 units per second

    particles.push({
      id: `particle-${Date.now()}-${i}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 1.0,
      maxLife: 1.0,
      size: 4 + Math.random() * 4, // 4-8 pixels
    });
  }

  return particles;
};

/**
 * Update particles (called every frame)
 */
export const updateParticles = (
  particles: Particle[],
  deltaSeconds: number
): Particle[] => {
  return particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * deltaSeconds,
      y: particle.y + particle.vy * deltaSeconds,
      life: particle.life - deltaSeconds * 0.5, // Decay over 2 seconds
    }))
    .filter((particle) => particle.life > 0);
};
