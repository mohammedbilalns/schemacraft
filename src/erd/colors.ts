export interface ColorTheme {
  border: string;
  headerBg: string;
  typeColor: string;
  badgeBg: string;
  badgeText: string;
  accentGlow: string;
}

export const ERD_COLORS: Record<string, ColorTheme> = {
  blue: {
    border: '#3b82f6',
    headerBg: 'rgba(59, 130, 246, 0.08)',
    typeColor: '#60a5fa',
    badgeBg: 'rgba(59, 130, 246, 0.2)',
    badgeText: '#93c5fd',
    accentGlow: 'rgba(59, 130, 246, 0.3)',
  },
  green: {
    border: '#10b981',
    headerBg: 'rgba(16, 185, 129, 0.08)',
    typeColor: '#34d399',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeText: '#6ee7b7',
    accentGlow: 'rgba(16, 185, 129, 0.3)',
  },
  orange: {
    border: '#f97316',
    headerBg: 'rgba(249, 115, 22, 0.08)',
    typeColor: '#fb923c',
    badgeBg: 'rgba(249, 115, 22, 0.2)',
    badgeText: '#fdba74',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
  },
  purple: {
    border: '#a855f7',
    headerBg: 'rgba(168, 85, 247, 0.08)',
    typeColor: '#c084fc',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    badgeText: '#d8b4fe',
    accentGlow: 'rgba(168, 85, 247, 0.3)',
  },
  red: {
    border: '#ef4444',
    headerBg: 'rgba(239, 68, 68, 0.08)',
    typeColor: '#f87171',
    badgeBg: 'rgba(239, 68, 68, 0.2)',
    badgeText: '#fca5a5',
    accentGlow: 'rgba(239, 68, 68, 0.3)',
  },
  gray: {
    border: '#64748b',
    headerBg: 'rgba(100, 116, 139, 0.08)',
    typeColor: '#94a3b8',
    badgeBg: 'rgba(100, 116, 139, 0.2)',
    badgeText: '#cbd5e1',
    accentGlow: 'rgba(100, 116, 139, 0.3)',
  },
  teal: {
    border: '#14b8a6',
    headerBg: 'rgba(20, 184, 166, 0.08)',
    typeColor: '#2dd4bf',
    badgeBg: 'rgba(20, 184, 166, 0.2)',
    badgeText: '#5eead4',
    accentGlow: 'rgba(20, 184, 166, 0.3)',
  },
  yellow: {
    border: '#eab308',
    headerBg: 'rgba(234, 179, 8, 0.08)',
    typeColor: '#fde047',
    badgeBg: 'rgba(234, 179, 8, 0.2)',
    badgeText: '#fef08a',
    accentGlow: 'rgba(234, 179, 8, 0.3)',
  },
  pink: {
    border: '#ec4899',
    headerBg: 'rgba(236, 72, 153, 0.08)',
    typeColor: '#f472b6',
    badgeBg: 'rgba(236, 72, 153, 0.2)',
    badgeText: '#fbcfe8',
    accentGlow: 'rgba(236, 72, 153, 0.3)',
  },
  cyan: {
    border: '#06b6d4',
    headerBg: 'rgba(6, 182, 212, 0.08)',
    typeColor: '#22d3ee',
    badgeBg: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#67e8f9',
    accentGlow: 'rgba(6, 182, 212, 0.3)',
  },
};

export function getColorTheme(colorName?: string): ColorTheme {
  const normalized = (colorName || 'blue').toLowerCase().trim();
  return ERD_COLORS[normalized] || ERD_COLORS.blue;
}
