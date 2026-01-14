/**
 * Achievement system configuration
 * Defines all unlockable achievements in the game
 */

/**
 * Achievement ID type
 */
export type AchievementId =
  | 'first_game'
  | 'score_1000'
  | 'score_5000'
  | 'score_10000'
  | 'score_25000'
  | 'score_50000'
  | 'games_10'
  | 'games_50'
  | 'games_100'
  | 'combo_5'
  | 'combo_10'
  | 'combo_15'
  | 'all_modes'
  | 'difficulty_7'
  | 'difficulty_10'
  | 'speed_demon'
  | 'endless_master'
  | 'time_attack_pro'
  | 'ad_free'; // Special: removes banner ads

/**
 * Achievement category
 */
export type AchievementCategory = 'beginner' | 'score' | 'combo' | 'mastery' | 'special';

/**
 * Achievement configuration
 */
export type Achievement = {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: number; // Target value to unlock
  hidden?: boolean; // Hidden until unlocked
};

/**
 * Achievement progress tracking
 */
export type AchievementProgress = {
  unlocked: boolean;
  unlockedAt?: number; // Timestamp
  progress: number; // Current progress value
};

/**
 * All achievements configuration
 */
export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  // Beginner achievements
  first_game: {
    id: 'first_game',
    name: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    category: 'beginner',
    requirement: 1,
  },
  games_10: {
    id: 'games_10',
    name: 'Getting Started',
    description: 'Play 10 games',
    icon: '🎯',
    category: 'beginner',
    requirement: 10,
  },
  games_50: {
    id: 'games_50',
    name: 'Dedicated Player',
    description: 'Play 50 games',
    icon: '🔥',
    category: 'beginner',
    requirement: 50,
  },
  games_100: {
    id: 'games_100',
    name: 'Veteran',
    description: 'Play 100 games',
    icon: '⭐',
    category: 'beginner',
    requirement: 100,
  },

  // Score achievements
  score_1000: {
    id: 'score_1000',
    name: 'Rising Star',
    description: 'Score 1,000 points in a game',
    icon: '🌟',
    category: 'score',
    requirement: 1000,
  },
  score_5000: {
    id: 'score_5000',
    name: 'High Scorer',
    description: 'Score 5,000 points in a game',
    icon: '💫',
    category: 'score',
    requirement: 5000,
  },
  score_10000: {
    id: 'score_10000',
    name: 'Score Master',
    description: 'Score 10,000 points in a game',
    icon: '✨',
    category: 'score',
    requirement: 10000,
  },
  score_25000: {
    id: 'score_25000',
    name: 'Elite Player',
    description: 'Score 25,000 points in a game',
    icon: '🏆',
    category: 'score',
    requirement: 25000,
  },
  score_50000: {
    id: 'score_50000',
    name: 'Legend',
    description: 'Score 50,000 points in a game',
    icon: '👑',
    category: 'score',
    requirement: 50000,
  },

  // Combo achievements
  combo_5: {
    id: 'combo_5',
    name: 'Combo Starter',
    description: 'Achieve a 5x combo',
    icon: '⚡',
    category: 'combo',
    requirement: 5,
  },
  combo_10: {
    id: 'combo_10',
    name: 'Combo Expert',
    description: 'Achieve a 10x combo',
    icon: '💥',
    category: 'combo',
    requirement: 10,
  },
  combo_15: {
    id: 'combo_15',
    name: 'Combo God',
    description: 'Achieve a 15x combo',
    icon: '⚡',
    category: 'combo',
    requirement: 15,
  },

  // Mastery achievements
  all_modes: {
    id: 'all_modes',
    name: 'Mode Master',
    description: 'Play all game modes',
    icon: '🎨',
    category: 'mastery',
    requirement: 4, // 4 modes total
  },
  difficulty_7: {
    id: 'difficulty_7',
    name: 'Challenge Accepted',
    description: 'Complete a game on difficulty 7+',
    icon: '🔥',
    category: 'mastery',
    requirement: 7,
  },
  difficulty_10: {
    id: 'difficulty_10',
    name: 'Impossible',
    description: 'Complete a game on MAX difficulty',
    icon: '💀',
    category: 'mastery',
    requirement: 10,
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Score 3,000+ in Time Attack mode',
    icon: '⏱️',
    category: 'mastery',
    requirement: 3000,
  },
  endless_master: {
    id: 'endless_master',
    name: 'Endless Master',
    description: 'Score 10,000+ in Endless mode',
    icon: '♾️',
    category: 'mastery',
    requirement: 10000,
  },
  time_attack_pro: {
    id: 'time_attack_pro',
    name: 'Time Attack Pro',
    description: 'Score 5,000+ in Time Attack mode',
    icon: '⏰',
    category: 'mastery',
    requirement: 5000,
  },

  // Special achievement (unlocks ad-free experience)
  ad_free: {
    id: 'ad_free',
    name: 'Ad-Free Master',
    description: 'Unlock 10 achievements to remove banner ads!',
    icon: '🎁',
    category: 'special',
    requirement: 10, // Unlock 10 achievements
    hidden: true, // Hidden until close to unlocking
  },
};

/**
 * Get all achievements as array
 */
export const getAllAchievements = (): Achievement[] => {
  return Object.values(ACHIEVEMENTS);
};

/**
 * Get achievements by category
 */
export const getAchievementsByCategory = (
  category: AchievementCategory
): Achievement[] => {
  return getAllAchievements().filter((a) => a.category === category);
};

/**
 * Get achievement by ID
 */
export const getAchievement = (id: AchievementId): Achievement => {
  return ACHIEVEMENTS[id];
};

/**
 * Category display names
 */
export const CATEGORY_NAMES: Record<AchievementCategory, string> = {
  beginner: 'BEGINNER',
  score: 'SCORE',
  combo: 'COMBO',
  mastery: 'MASTERY',
  special: 'SPECIAL',
};
