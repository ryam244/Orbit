/**
 * Game mode definitions
 * Supports different play styles with unique rules
 */

export type GameMode = 'standard' | 'timeAttack' | 'endless' | 'puzzle';

export type GameModeConfig = {
  id: GameMode;
  name: string;
  description: string;
  rules: string[];
  icon: string;
};

/**
 * Game mode configurations
 */
export const GAME_MODE_CONFIGS: Record<GameMode, GameModeConfig> = {
  // Standard mode - Normal gameplay with difficulty levels
  standard: {
    id: 'standard',
    name: 'Standard',
    description: '通常モード',
    rules: [
      '選択した難易度でプレイ',
      'ブロックが埋まるとゲームオーバー',
      'スコアを競う',
    ],
    icon: '🎮',
  },

  // Time Attack - Score as much as possible in limited time
  timeAttack: {
    id: 'timeAttack',
    name: 'Time Attack',
    description: '制限時間内にスコアを稼ぐ',
    rules: [
      '制限時間: 2分',
      '時間切れでゲーム終了',
      'ブロックが埋まっても続行',
      'ハイスコアを目指す',
    ],
    icon: '⏱️',
  },

  // Endless - Infinite gameplay, no game over
  endless: {
    id: 'endless',
    name: 'Endless',
    description: '無限モード',
    rules: [
      'ゲームオーバーなし',
      '自動的にブロックを消去',
      'どこまでスコアを伸ばせるか',
      '手動終了のみ',
    ],
    icon: '♾️',
  },

  // Puzzle - Clear specific patterns
  puzzle: {
    id: 'puzzle',
    name: 'Puzzle',
    description: 'パズルモード',
    rules: [
      '特定のパターンをクリア',
      '制限手数内にクリア',
      '全ステージクリアを目指す',
      'スコア制限なし',
    ],
    icon: '🧩',
  },
};

/**
 * Time Attack mode settings
 */
export const TIME_ATTACK_DURATION = 120; // 2 minutes in seconds

/**
 * Endless mode settings
 */
export const ENDLESS_AUTO_CLEAR_THRESHOLD = 0.8; // Auto-clear when 80% full

/**
 * Get game mode config
 */
export const getGameModeConfig = (mode: GameMode): GameModeConfig => {
  return GAME_MODE_CONFIGS[mode];
};

/**
 * Default game mode
 */
export const DEFAULT_GAME_MODE: GameMode = 'standard';
