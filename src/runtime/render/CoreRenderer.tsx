/**
 * Core and ring renderer
 * Draws the central core circle and ring guides
 */

import React from 'react';
import { Circle, Group, Line, vec } from '@shopify/react-native-skia';
import { GameConfig } from '../../constants/GameConfig';

type CoreRendererProps = {
  centerX: number;
  centerY: number;
  debug?: boolean;
};

/**
 * Color palette - Cyberpunk neon theme
 */
const COLORS = {
  core: '#00ffff', // Cyan core
  ring: 'rgba(0, 255, 255, 0.2)', // Semi-transparent cyan
  sector: 'rgba(255, 0, 255, 0.1)', // Semi-transparent magenta
};

/**
 * Renders the core (center circle) and ring guides
 */
export const CoreRenderer: React.FC<CoreRendererProps> = ({
  centerX,
  centerY,
  debug = false,
}) => {
  const { coreRadius, ringSpacing, ringCount, sectorCount } = GameConfig;

  // Generate ring radii
  const rings = Array.from({ length: ringCount }, (_, i) => {
    return coreRadius + i * ringSpacing;
  });

  // Generate sector angles for guides
  const sectorAngles = Array.from({ length: sectorCount }, (_, i) => {
    return (i * 2 * Math.PI) / sectorCount;
  });

  return (
    <Group>
      {/* Core circle */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={coreRadius}
        color={COLORS.core}
        style="stroke"
        strokeWidth={2}
      />

      {/* Core glow effect */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={coreRadius + 4}
        color={COLORS.core}
        style="stroke"
        strokeWidth={1}
        opacity={0.3}
      />

      {/* Ring guides */}
      {rings.map((radius, index) => (
        <Circle
          key={`ring-${index}`}
          cx={centerX}
          cy={centerY}
          r={radius}
          color={COLORS.ring}
          style="stroke"
          strokeWidth={1}
        />
      ))}

      {/* Sector guides (radial lines) - only in debug mode */}
      {debug &&
        sectorAngles.map((angle, index) => {
          const outerRadius = coreRadius + (ringCount - 1) * ringSpacing;
          const startX = centerX + Math.cos(angle) * coreRadius;
          const startY = centerY + Math.sin(angle) * coreRadius;
          const endX = centerX + Math.cos(angle) * outerRadius;
          const endY = centerY + Math.sin(angle) * outerRadius;

          return (
            <Line
              key={`sector-${index}`}
              p1={vec(startX, startY)}
              p2={vec(endX, endY)}
              color={COLORS.sector}
              strokeWidth={1}
            />
          );
        })}
    </Group>
  );
};
