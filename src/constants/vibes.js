/**
 * Vibe Presets — Quick focus filters that shape the draw pool
 * based on who's leading or who benefits most.
 *
 * Each vibe defines:
 *  - which categories to include
 *  - which oral sub-types to include (if Oral isn't excluded)
 *  - a default set of excluded categories (user can still override)
 */

/** All 10 position categories in display order */
export const ALL_CATEGORIES = [
  'Classic',
  'Face to Face',
  'From Behind',
  'Side by Side',
  'Woman on Top',
  'Man on Top',
  'Sitting',
  'Standing',
  'Oral',
  'Edge & Furniture',
];

/** Oral sub-type filter options */
export const ORAL_SUBTYPES = [
  { id: 'all-oral', label: 'All Oral', description: 'Every oral position' },
  { id: 'blowjob', label: 'Blowjob Only', description: 'Fellatio positions (for him)', tag: 'blowjob' },
  { id: 'cunnilingus', label: 'Cunnilingus Only', description: 'Oral for her', tag: 'cunnilingus' },
  { id: '69', label: '69 Only', description: 'Mutual oral positions', tag: '69 sex position' },
  { id: 'no-cunnilingus', label: 'No Cunnilingus', description: 'Exclude oral-on-her positions' },
  { id: 'no-blowjob', label: 'No Blowjob', description: 'Exclude fellatio positions' },
];

/**
 * Vibe presets with category & oral sub-type pre-selections.
 * `excludedCategories` — categories turned off by default for this vibe.
 * `oralSubtype` — the default oral sub-filter for this vibe.
 */
export const VIBE_PRESETS = [
  {
    id: 'our-night',
    label: 'Our Night',
    icon: '💞',
    badge: 'Together',
    description: 'The full experience — every category, every angle, for both of you.',
    excludedCategories: [],
    oralSubtype: 'all-oral',
  },
  {
    id: 'his-night',
    label: 'His Night',
    icon: '🔥',
    badge: 'For Him',
    description: 'Dominant positions and angles that put him in control.',
    excludedCategories: [],
    oralSubtype: 'no-cunnilingus',
  },
  {
    id: 'her-night',
    label: 'Her Night',
    icon: '✨',
    badge: 'For Her',
    description: 'Intimate, sensual positions designed for her pleasure.',
    excludedCategories: ['From Behind'],
    oralSubtype: 'no-blowjob',
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: '🎛️',
    badge: 'Your Rules',
    description: 'Hand-pick exactly which categories and oral types to include.',
    excludedCategories: [],
    oralSubtype: 'all-oral',
  },
];

/**
 * Build the filter function for a given vibe configuration.
 *
 * @param {Set<string>} excludedCategories - categories the user has turned off
 * @param {string} oralSubtype - one of the ORAL_SUBTYPES ids
 * @returns {(position: object) => boolean}
 */
export function buildVibeFilter(excludedCategories, oralSubtype) {
  return (position) => {
    const cat = position.category;

    // 1. If the category is excluded entirely, reject
    if (excludedCategories.has(cat)) return false;

    // 2. If this is an Oral position, apply the oral sub-filter
    if (cat === 'Oral') {
      const tags = position.tags || [];
      switch (oralSubtype) {
        case 'blowjob':
          return tags.includes('blowjob');
        case 'cunnilingus':
          return tags.includes('cunnilingus');
        case '69':
          return tags.includes('69 sex position');
        case 'no-cunnilingus':
          return !tags.includes('cunnilingus');
        case 'no-blowjob':
          return !tags.includes('blowjob');
        case 'all-oral':
        default:
          return true;
      }
    }

    // 3. Non-oral, non-excluded → include
    return true;
  };
}

