export type ThemeMode = 'light' | 'dark' | 'emerald' | 'obsidian_gold' | 'cosmic';

export interface ThemeVariables {
  '--navy': string;
  '--navy-deep': string;
  '--green': string;
  '--gold': string;
  '--ink': string;
  '--paper': string;
  '--paper-2': string;
  '--line': string;
  '--blue-accent': string;
  '--white': string;
  '--card-bg': string;
  '--header-bg': string;
  '--muted-text': string;
  '--glow-color': string;
  '--accent-gradient': string;
}

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  subtitle: string;
  iconName: string;
  previewColors: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Royal Ivory',
    subtitle: 'High-contrast clean academic light',
    iconName: 'Sun',
    previewColors: ['#132C54', '#2E9B58', '#CC9A2E', '#F6F8FB'],
  },
  {
    id: 'dark',
    name: 'Midnight Navy',
    subtitle: 'Deep focus cyber-azure dark',
    iconName: 'Moon',
    previewColors: ['#0B1120', '#3B82F6', '#38BDF8', '#1E293B'],
  },
  {
    id: 'emerald',
    name: 'Biolum Emerald',
    subtitle: 'High-tech matrix green & mint',
    iconName: 'Sparkles',
    previewColors: ['#041D14', '#10B981', '#34D399', '#064E3B'],
  },
  {
    id: 'obsidian_gold',
    name: 'Obsidian Gold',
    subtitle: 'Imperial solar gold & dark onyx',
    iconName: 'Award',
    previewColors: ['#12100E', '#F59E0B', '#FBBF24', '#261F16'],
  },
  {
    id: 'cosmic',
    name: 'Cosmic Aurora',
    subtitle: 'Deep indigo, neon violet & cyan glow',
    iconName: 'Zap',
    previewColors: ['#0E0B20', '#8B5CF6', '#EC4899', '#1E1B4B'],
  },
];

export const THEME_CONFIGS: Record<ThemeMode, ThemeVariables> = {
  light: {
    '--navy': '#132C54',
    '--navy-deep': '#0B1D3A',
    '--green': '#2E9B58',
    '--gold': '#CC9A2E',
    '--ink': '#0E1930',
    '--paper': '#F6F8FB',
    '--paper-2': '#ECF0F6',
    '--line': '#D8DFEA',
    '--blue-accent': '#2F6FE0',
    '--white': '#ffffff',
    '--card-bg': '#ffffff',
    '--header-bg': 'rgba(255, 255, 255, 0.95)',
    '--muted-text': '#4C5A75',
    '--glow-color': 'rgba(47, 111, 224, 0.25)',
    '--accent-gradient': 'linear-gradient(135deg, #132C54 0%, #2F6FE0 100%)',
  },
  dark: {
    '--navy': '#3B82F6',
    '--navy-deep': '#F8FAFC',
    '--green': '#34D399',
    '--gold': '#FBBF24',
    '--ink': '#F1F5F9',
    '--paper': '#0B1120',
    '--paper-2': '#1E293B',
    '--line': '#334155',
    '--blue-accent': '#38BDF8',
    '--white': '#1E293B',
    '--card-bg': '#1E293B',
    '--header-bg': 'rgba(15, 23, 42, 0.95)',
    '--muted-text': '#94A3B8',
    '--glow-color': 'rgba(56, 189, 248, 0.3)',
    '--accent-gradient': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
  },
  emerald: {
    '--navy': '#10B981',
    '--navy-deep': '#ECFDF5',
    '--green': '#34D399',
    '--gold': '#FBBF24',
    '--ink': '#F0FDF4',
    '--paper': '#041710',
    '--paper-2': '#062C1E',
    '--line': '#0F5132',
    '--blue-accent': '#10B981',
    '--white': '#062C1E',
    '--card-bg': '#072419',
    '--header-bg': 'rgba(4, 23, 16, 0.95)',
    '--muted-text': '#86EFAC',
    '--glow-color': 'rgba(16, 185, 129, 0.35)',
    '--accent-gradient': 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
  },
  obsidian_gold: {
    '--navy': '#F59E0B',
    '--navy-deep': '#FFFBEB',
    '--green': '#10B981',
    '--gold': '#FBBF24',
    '--ink': '#FFFBEB',
    '--paper': '#0F0D0B',
    '--paper-2': '#1F1B16',
    '--line': '#3F3526',
    '--blue-accent': '#F59E0B',
    '--white': '#1F1B16',
    '--card-bg': '#191511',
    '--header-bg': 'rgba(15, 13, 11, 0.96)',
    '--muted-text': '#FDE68A',
    '--glow-color': 'rgba(245, 158, 11, 0.35)',
    '--accent-gradient': 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FCD34D 100%)',
  },
  cosmic: {
    '--navy': '#A855F7',
    '--navy-deep': '#FAF5FF',
    '--green': '#06B6D4',
    '--gold': '#F43F5E',
    '--ink': '#FDF4FF',
    '--paper': '#0B0817',
    '--paper-2': '#191233',
    '--line': '#3B2D6B',
    '--blue-accent': '#C084FC',
    '--white': '#191233',
    '--card-bg': '#140E29',
    '--header-bg': 'rgba(11, 8, 23, 0.96)',
    '--muted-text': '#D8B4FE',
    '--glow-color': 'rgba(168, 85, 247, 0.35)',
    '--accent-gradient': 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #06B6D4 100%)',
  },
};

/**
 * Apply theme variables directly to the root HTML document element
 */
export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  const variables = THEME_CONFIGS[theme] || THEME_CONFIGS.light;

  // Update root CSS variables
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Toggle dark class & data-theme attribute
  if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
  }
  root.setAttribute('data-theme', theme);

  // Persist choice to localStorage
  try {
    localStorage.setItem('ilearnit_theme', theme);
  } catch (err) {
    console.warn('Unable to persist theme to localStorage:', err);
  }
}

/**
 * Get initial theme mode from localStorage or system preference
 */
export function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('ilearnit_theme') as ThemeMode;
    if (saved && THEME_CONFIGS[saved]) {
      return saved;
    }
  } catch (err) {
    // Ignore localStorage access issues
  }

  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}
