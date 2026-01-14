/**
 * Block renderer
 * Draws grid blocks and active falling block
 */

import React, { useMemo } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import { GameConfig } from '../../constants/GameConfig';
import { sectorToCartesian } from '../../utils/math';
import { getRing, getSector } from '../../utils/grid';
import type { ActiveBlock, BlockColor } from '../../engine/types';

type BlockRendererProps = {
  centerX: number;
  centerY: number;
  grid: Uint8Array;
  activeBlock: ActiveBlock | null;
};

/**
 * Block color mapping - Cyberpunk neon colors
 */
const BLOCK_COLORS: Record<Exclude<BlockColor, 0>, string> = {
  1: '#00ffff', // Cyan
  2: '#ff00ff', // Magenta
  3: '#ffff00', // Yellow
  4: '#00ff00', // Green
  5: '#ff6600', // Orange
  6: '#0088ff', // Blue
};

const BLOCK_RADIUS = 8; // Visual radius of blocks
const GLOW_OPACITY = 0.5;

/**
 * Renders a single block at a specific position
 */
const Block: React.FC<{
  x: number;
  y: number;
  color: string;
  active?: boolean;
}> = ({ x, y, color, active = false }) => {
  return (
    <Group>
      {/* Glow effect */}
      <Circle
        cx={x}
        cy={y}
        r={BLOCK_RADIUS + 4}
        color={color}
        opacity={active ? GLOW_OPACITY * 1.5 : GLOW_OPACITY}
      />

      {/* Main block */}
      <Circle
        cx={x}
        cy={y}
        r={BLOCK_RADIUS}
        color={color}
        style="fill"
      />

      {/* Outline */}
      <Circle
        cx={x}
        cy={y}
        r={BLOCK_RADIUS}
        color={color}
        style="stroke"
        strokeWidth={2}
        opacity={0.8}
      />
    </Group>
  );
};

/**
 * Renders all blocks on the grid
 */
export const BlockRenderer: React.FC<BlockRendererProps> = ({
  centerX,
  centerY,
  grid,
  activeBlock,
}) => {
  const { sectorCount, ringCount } = GameConfig;

  // Pre-calculate grid block positions
  const gridBlocks = useMemo(() => {
    const blocks: Array<{ x: number; y: number; color: string }> = [];

    for (let i = 0; i < grid.length; i++) {
      const colorValue = grid[i];
      if (colorValue === 0) continue; // Skip empty cells

      const ring = getRing(i);
      const sector = getSector(i);
      const pos = sectorToCartesian(sector, ring);

      blocks.push({
        x: centerX + pos.x,
        y: centerY + pos.y,
        color: BLOCK_COLORS[colorValue as Exclude<BlockColor, 0>],
      });
    }

    return blocks;
  }, [grid, centerX, centerY]);

  // Calculate active block position
  const activeBlockPos = useMemo(() => {
    if (!activeBlock) return null;

    const pos = sectorToCartesian(activeBlock.sector, activeBlock.ringPos);
    return {
      x: centerX + pos.x,
      y: centerY + pos.y,
      color: BLOCK_COLORS[activeBlock.color],
    };
  }, [activeBlock, centerX, centerY]);

  return (
    <Group>
      {/* Render grid blocks */}
      {gridBlocks.map((block, index) => (
        <Block key={`grid-${index}`} x={block.x} y={block.y} color={block.color} />
      ))}

      {/* Render active falling block */}
      {activeBlockPos && (
        <Block
          x={activeBlockPos.x}
          y={activeBlockPos.y}
          color={activeBlockPos.color}
          active
        />
      )}
    </Group>
  );
};
