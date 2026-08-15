export type ThemeMode = 'light' | 'dark';

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
}

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
  },
};

/**
 * Apply theme variables directly to the root HTML document element
 */
export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  const variables = THEME_CONFIGS[theme];

  // Update root CSS variables
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Toggle dark class & data-theme attribute
  if (theme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

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
    const saved = localStorage.getItem('ilearnit_theme');
    if (saved === 'dark' || saved === 'light') {
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
