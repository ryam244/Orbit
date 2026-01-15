/**
 * Difficulty level configurations
 * 10 levels from Very Easy to Nightmare
 */

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type DifficultyConfig = {
  level: DifficultyLevel;
  name: string;
  description: string;

  // Game parameters
  initialVelocity: number; // rings per second
  velocityIncrement: number; // speed increase per level
  maxVelocity: number; // maximum fall speed
  colorCount: number; // number of block colors (2-6)

  // Score multiplier for normalization
  // Higher difficulty = higher multiplier
  // Normalized score = raw score × multiplier
  scoreMultiplier: number;
};

/**
 * Difficulty configurations for all 10 levels
 */
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  // Level 1: Very Easy - Perfect for beginners
  1: {
    level: 1,
    name: 'Very Easy',
    description: 'Slow speed, 2 colors',
    initialVelocity: 1.5,
    velocityIncrement: 0.1,
    maxVelocity: 5.0,
    colorCount: 2,
    scoreMultiplier: 1.0,
  },

  // Level 2: Easy - Still relaxed
  2: {
    level: 2,
    name: 'Easy',
    description: 'Slow speed, 3 colors',
    initialVelocity: 2.0,
    velocityIncrement: 0.12,
    maxVelocity: 6.0,
    colorCount: 3,
    scoreMultiplier: 1.2,
  },

  // Level 3: Beginner - Slightly faster
  3: {
    level: 3,
    name: 'Beginner',
    description: 'Moderate speed, 3 colors',
    initialVelocity: 2.5,
    velocityIncrement: 0.15,
    maxVelocity: 7.0,
    colorCount: 3,
    scoreMultiplier: 1.4,
  },

  // Level 4: Normal - Balanced (original difficulty)
  4: {
    level: 4,
    name: 'Normal',
    description: 'Balanced difficulty',
    initialVelocity: 3.0,
    velocityIncrement: 0.2,
    maxVelocity: 10.0,
    colorCount: 4,
    scoreMultiplier: 1.6,
  },

  // Level 5: Intermediate - Getting challenging
  5: {
    level: 5,
    name: 'Intermediate',
    description: 'Fast speed, 4 colors',
    initialVelocity: 3.5,
    velocityIncrement: 0.25,
    maxVelocity: 12.0,
    colorCount: 4,
    scoreMultiplier: 1.8,
  },

  // Level 6: Hard - Serious challenge
  6: {
    level: 6,
    name: 'Hard',
    description: 'Very fast, 5 colors',
    initialVelocity: 4.0,
    velocityIncrement: 0.3,
    maxVelocity: 15.0,
    colorCount: 5,
    scoreMultiplier: 2.0,
  },

  // Level 7: Expert - For skilled players
  7: {
    level: 7,
    name: 'Expert',
    description: 'Extreme speed, 5 colors',
    initialVelocity: 4.5,
    velocityIncrement: 0.35,
    maxVelocity: 18.0,
    colorCount: 5,
    scoreMultiplier: 2.3,
  },

  // Level 8: Master - Nearly impossible
  8: {
    level: 8,
    name: 'Master',
    description: 'Blazing speed, 6 colors',
    initialVelocity: 5.0,
    velocityIncrement: 0.4,
    maxVelocity: 20.0,
    colorCount: 6,
    scoreMultiplier: 2.6,
  },

  // Level 9: Insane - Extreme difficulty
  9: {
    level: 9,
    name: 'Insane',
    description: 'Insane speed, 6 colors',
    initialVelocity: 5.5,
    velocityIncrement: 0.45,
    maxVelocity: 25.0,
    colorCount: 6,
    scoreMultiplier: 3.0,
  },

  // Level 10: Nightmare - Ultimate challenge
  10: {
    level: 10,
    name: 'Nightmare',
    description: 'Maximum difficulty',
    initialVelocity: 6.0,
    velocityIncrement: 0.5,
    maxVelocity: 30.0,
    colorCount: 6,
    scoreMultiplier: 3.5,
  },
};

/**
 * Get difficulty config by level
 */
export const getDifficultyConfig = (level: DifficultyLevel): DifficultyConfig => {
  return DIFFICULTY_CONFIGS[level];
};

/**
 * Calculate normalized score for unified ranking
 * Normalized score allows fair comparison across all difficulties
 */
export const calculateNormalizedScore = (
  rawScore: number,
  difficulty: DifficultyLevel
): number => {
  const config = getDifficultyConfig(difficulty);
  return Math.floor(rawScore * config.scoreMultiplier);
};

/**
 * Default difficulty level
 */
export const DEFAULT_DIFFICULTY: DifficultyLevel = 4; // Normal
