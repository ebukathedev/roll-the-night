export const BALL_COLORS = [
  '#ff3d81',
  '#ffc83d',
  '#2ec4b6',
  '#7b5cff',
  '#ff7a3d',
  '#3da5ff',
];

export function darkenColor(hex, factor = 0.55) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 255) * factor));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * factor));
  const b = Math.max(0, Math.floor((num & 255) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

