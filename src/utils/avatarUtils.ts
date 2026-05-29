const AVATAR_MAP: Record<string, string> = {
  'avatar_user': '👤',
  'avatar_dev_m': '👨‍💻',
  'avatar_dev_f': '👩‍💻',
  'avatar_suit': '💼',
  'avatar_pizza': '🍕',
  'avatar_game': '🎮',
  'avatar_star': '🌟',
  'avatar_unicorn': '🦄',
  'avatar_lion': '🦁',
  'avatar_rocket': '🚀',
  'avatar_paint': '🎨',
  'avatar_money': '💸',
  'default': '👤'
};

const EMOJI_TO_KEY_MAP: Record<string, string> = {
  '👤': 'avatar_user',
  '👨‍💻': 'avatar_dev_m',
  '👩‍💻': 'avatar_dev_f',
  '💼': 'avatar_suit',
  '🍕': 'avatar_pizza',
  '🎮': 'avatar_game',
  '🌟': 'avatar_star',
  '🦄': 'avatar_unicorn',
  '🦁': 'avatar_lion',
  '🚀': 'avatar_rocket',
  '🎨': 'avatar_paint',
  '💸': 'avatar_money'
};

export const getEmojiFromKey = (key: string): string => {
  return AVATAR_MAP[key] || AVATAR_MAP['default'];
};

export const getKeyFromEmoji = (emoji: string): string => {
  return EMOJI_TO_KEY_MAP[emoji] || 'default';
};
