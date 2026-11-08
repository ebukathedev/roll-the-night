export const SPICINESS_LEVELS = [
  {
    id: 'mild',
    label: 'Mild',
    icon: '🌶️',
    badge: 'Play It Safe',
    description: 'Comfortable, easy-going & intimate. Zero gymnastics required.',
    filter: (p) => p.level?.toLowerCase() === 'safe',
  },
  {
    id: 'spicy',
    label: 'Spicy',
    icon: '🌶️🌶️',
    badge: 'Daring & Fun',
    description: 'A balanced mix of classic comfort and exciting new angles.',
    filter: (p) => p.level?.toLowerCase() === 'safe' || p.level?.toLowerCase() === 'be careful',
  },
  {
    id: 'wild',
    label: 'Wild',
    icon: '🔥',
    badge: 'Adventurous',
    description: 'Athletic, daring, and acrobatic positions for fearless couples.',
    filter: (p) => p.level?.toLowerCase() === 'be careful' || p.level?.toLowerCase() === 'dangerous',
  },
  {
    id: 'all',
    label: 'All In',
    icon: '🎲',
    badge: 'Full Catalog',
    description: 'The complete spectrum — from gentle embraces to wild stunts.',
    filter: () => true,
  },
];

