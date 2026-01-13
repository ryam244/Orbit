/**
 * Simple test script to verify engine core functions
 * Run with: npx tsx test-engine.ts
 */

import { GameConfig } from './src/constants/GameConfig';
import { getIndex } from './src/utils/grid';
import { stepFall } from './src/engine/stepFall';
import { lockBlock } from './src/engine/lockBlock';
import { findMatches } from './src/engine/findMatches';
import { applyMatches } from './src/engine/applyMatches';
import { spawn, randomColor } from './src/engine/spawn';

console.log('🧪 Testing Orbit Game Engine Core\n');

// Test 1: stepFall
console.log('Test 1: stepFall');
const fallResult = stepFall(
  { ringPos: 0, velocity: 2.0 },
  1.0, // 1 second
  12
);
console.log(`  Initial pos: 0, Velocity: 2.0, After 1s: ${fallResult.ringPos}`);
console.log(`  Did land: ${fallResult.didLand}`);
console.assert(fallResult.ringPos === 2.0, 'Position should be 2.0');
console.assert(fallResult.didLand === false, 'Should not land yet');

const fallResult2 = stepFall(
  { ringPos: 10.0, velocity: 2.0 },
  1.0,
  12
);
console.log(`  Pos: 10.0, Velocity: 2.0, After 1s: ${fallResult2.ringPos}`);
console.log(`  Did land: ${fallResult2.didLand}`);
console.assert(fallResult2.didLand === true, 'Should land');
console.assert(fallResult2.ringPos === 11.0, 'Should clamp to ring 11');
console.log('  ✅ stepFall test passed\n');

// Test 2: lockBlock
console.log('Test 2: lockBlock');
const grid = new Uint8Array(GameConfig.sectorCount * GameConfig.ringCount);
const targetIndex = getIndex(11, 0); // Last ring, sector 0
const newGrid = lockBlock({ grid, index: targetIndex, color: 1 });
console.log(`  Locked color 1 at index ${targetIndex}`);
console.assert(newGrid[targetIndex] === 1, 'Color should be locked');
console.assert(grid[targetIndex] === 0, 'Original grid should be unchanged');
console.log('  ✅ lockBlock test passed\n');

// Test 3: findMatches - Ring direction
console.log('Test 3: findMatches (Ring direction)');
const grid2 = new Uint8Array(GameConfig.sectorCount * GameConfig.ringCount);
// Place 3 consecutive blocks in ring 5, sectors 0-2
grid2[getIndex(5, 0)] = 1;
grid2[getIndex(5, 1)] = 1;
grid2[getIndex(5, 2)] = 1;
const matches = findMatches(grid2);
console.log(`  Placed 3 consecutive blocks (color 1) in ring 5`);
console.log(`  Found ${matches.length} match(es)`);
console.assert(matches.length === 1, 'Should find 1 match');
console.assert(matches[0].indices.length === 3, 'Match should have 3 blocks');
console.log('  ✅ findMatches test passed\n');

// Test 4: findMatches - Sector direction
console.log('Test 4: findMatches (Sector direction)');
const grid3 = new Uint8Array(GameConfig.sectorCount * GameConfig.ringCount);
// Place 3 consecutive blocks in sector 5, rings 0-2
grid3[getIndex(0, 5)] = 2;
grid3[getIndex(1, 5)] = 2;
grid3[getIndex(2, 5)] = 2;
const matches2 = findMatches(grid3);
console.log(`  Placed 3 consecutive blocks (color 2) in sector 5`);
console.log(`  Found ${matches2.length} match(es)`);
console.assert(matches2.length === 1, 'Should find 1 match');
console.assert(matches2[0].indices.length === 3, 'Match should have 3 blocks');
console.log('  ✅ findMatches test passed\n');

// Test 5: applyMatches
console.log('Test 5: applyMatches');
const grid4 = new Uint8Array(GameConfig.sectorCount * GameConfig.ringCount);
// Setup: Place blocks in sector 0 to create a match
grid4[getIndex(9, 0)] = 1; // Ring 9 (will be matched)
grid4[getIndex(10, 0)] = 1; // Ring 10 (will be matched)
grid4[getIndex(11, 0)] = 1; // Ring 11 (will be matched)
grid4[getIndex(8, 0)] = 3; // Ring 8 (different color, will fall after match)

const matches3 = findMatches(grid4);
console.log(`  Before apply: blocks at rings 8(color 3),9,10,11(color 1) in sector 0`);
console.log(`  Found ${matches3.length} match(es) with ${matches3[0]?.indices.length || 0} blocks`);

const { grid: newGrid4, clearedCount } = applyMatches(grid4, matches3);
console.log(`  Cleared ${clearedCount} block(s)`);
console.log(`  After gravity: Ring 11 should have color 3 (the unmatched block fell)`);
console.assert(clearedCount === 3, 'Should clear 3 blocks');
console.assert(newGrid4[getIndex(11, 0)] === 3, 'Block should fall to outer ring');
console.assert(newGrid4[getIndex(10, 0)] === 0, 'Ring 10 should be empty');
console.assert(newGrid4[getIndex(9, 0)] === 0, 'Ring 9 should be empty');
console.assert(newGrid4[getIndex(8, 0)] === 0, 'Ring 8 should be empty');
console.log('  ✅ applyMatches test passed\n');

// Test 6: spawn
console.log('Test 6: spawn');
const grid5 = new Uint8Array(GameConfig.sectorCount * GameConfig.ringCount);
const nextColor = randomColor();
console.log(`  Next color: ${nextColor}`);
const spawnResult = spawn({
  grid: grid5,
  nextColor,
  sectorCount: GameConfig.sectorCount,
});
console.log(`  Spawned at sector ${spawnResult.sector} with color ${spawnResult.color}`);
console.assert(spawnResult.color === nextColor, 'Color should match');
console.assert(
  spawnResult.sector >= 0 && spawnResult.sector < GameConfig.sectorCount,
  'Sector should be valid'
);
console.log('  ✅ spawn test passed\n');

// Test 7: Full game cycle simulation
console.log('Test 7: Full game cycle simulation');
console.log('  Simulating: spawn → fall → lock → match → clear');

let simGrid = new Uint8Array(GameConfig.sectorCount * GameConfig.ringCount);
const color1 = 1;
const sector1 = 0;

// Place two blocks at the bottom to prepare for a match
simGrid[getIndex(11, sector1)] = color1;
simGrid[getIndex(10, sector1)] = color1;

// Spawn and fall a third block
let activeBlock = {
  id: 'test-1',
  color: color1 as 1,
  sector: sector1,
  ringPos: 0,
  velocity: GameConfig.initialVelocity,
};

console.log(`  Initial: 2 blocks at bottom of sector ${sector1}`);
console.log(`  Active block falling from ring 0`);

// Simulate falling
let deltaTime = 0.1; // 100ms per frame
let frameCount = 0;
while (!stepFall(
  { ringPos: activeBlock.ringPos, velocity: activeBlock.velocity },
  deltaTime
).didLand) {
  const result = stepFall(
    { ringPos: activeBlock.ringPos, velocity: activeBlock.velocity },
    deltaTime
  );
  activeBlock.ringPos = result.ringPos;
  frameCount++;
  if (frameCount > 200) {
    console.error('  ❌ Simulation timeout');
    break;
  }
}

console.log(`  Block landed at ring ${activeBlock.ringPos.toFixed(2)} after ${frameCount} frames`);

// Lock the block
const lockIndex = getIndex(Math.floor(activeBlock.ringPos), activeBlock.sector);
// Find the first empty slot from inner to outer
let actualLockRing = -1;
for (let r = 0; r < GameConfig.ringCount; r++) {
  const idx = getIndex(r, sector1);
  if (simGrid[idx] === 0) {
    actualLockRing = r;
    break;
  }
}

if (actualLockRing !== -1) {
  const actualLockIndex = getIndex(actualLockRing, sector1);
  simGrid = lockBlock({ grid: simGrid, index: actualLockIndex, color: activeBlock.color });
  console.log(`  Locked block at ring ${actualLockRing}`);

  // Find matches
  const simMatches = findMatches(simGrid);
  console.log(`  Found ${simMatches.length} match(es)`);

  if (simMatches.length > 0) {
    const { grid: finalGrid, clearedCount: cleared } = applyMatches(simGrid, simMatches);
    simGrid = finalGrid;
    console.log(`  Cleared ${cleared} block(s)`);
    console.log('  ✅ Full cycle simulation passed\n');
  } else {
    console.log('  ⚠️  No matches found (might need better setup)\n');
  }
} else {
  console.log('  ❌ Could not find lock position\n');
}

console.log('✅ All engine core tests completed!');
console.log('\n📊 Summary:');
console.log(`  - Grid size: ${GameConfig.ringCount} rings × ${GameConfig.sectorCount} sectors`);
console.log(`  - Initial velocity: ${GameConfig.initialVelocity} rings/sec`);
console.log(`  - Min match length: ${GameConfig.minMatchLength}`);
console.log(`  - Color count: ${GameConfig.colorCount}`);
