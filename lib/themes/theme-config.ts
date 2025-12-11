export type ThemeType = 'light' | 'dark' | 'minimal' | 'neon-cyber' | 'nature' | 'luxury';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}

export const THEME_CONFIG: Record<ThemeType, { name: string; colors: ThemeColors }> = {
  light: {
    name: '라이트',
    colors: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.145 0 0)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.145 0 0)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.145 0 0)',
      primary: 'oklch(0.205 0 0)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.97 0 0)',
      secondaryForeground: 'oklch(0.205 0 0)',
      muted: 'oklch(0.97 0 0)',
      mutedForeground: 'oklch(0.556 0 0)',
      accent: 'oklch(0.97 0 0)',
      accentForeground: 'oklch(0.205 0 0)',
      destructive: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.922 0 0)',
      input: 'oklch(0.922 0 0)',
      ring: 'oklch(0.708 0 0)',
    },
  },
  dark: {
    name: '다크',
    colors: {
      background: 'oklch(0.145 0 0)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.205 0 0)',
      cardForeground: 'oklch(0.985 0 0)',
      popover: 'oklch(0.205 0 0)',
      popoverForeground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.922 0 0)',
      primaryForeground: 'oklch(0.205 0 0)',
      secondary: 'oklch(0.269 0 0)',
      secondaryForeground: 'oklch(0.985 0 0)',
      muted: 'oklch(0.269 0 0)',
      mutedForeground: 'oklch(0.708 0 0)',
      accent: 'oklch(0.269 0 0)',
      accentForeground: 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.556 0 0)',
    },
  },
  minimal: {
    name: '미니멀',
    colors: {
      background: 'oklch(0.99 0 0)',
      foreground: 'oklch(0.2 0 0)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.2 0 0)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.2 0 0)',
      primary: 'oklch(0.3 0 0)',
      primaryForeground: 'oklch(0.99 0 0)',
      secondary: 'oklch(0.95 0 0)',
      secondaryForeground: 'oklch(0.3 0 0)',
      muted: 'oklch(0.96 0 0)',
      mutedForeground: 'oklch(0.5 0 0)',
      accent: 'oklch(0.95 0 0)',
      accentForeground: 'oklch(0.3 0 0)',
      destructive: 'oklch(0.5 0.15 20)',
      border: 'oklch(0.9 0 0)',
      input: 'oklch(0.9 0 0)',
      ring: 'oklch(0.4 0 0)',
    },
  },
  'neon-cyber': {
    name: '네온 사이버',
    colors: {
      background: 'oklch(0.15 0.02 270)',
      foreground: 'oklch(0.95 0.1 180)',
      card: 'oklch(0.18 0.03 270)',
      cardForeground: 'oklch(0.95 0.1 180)',
      popover: 'oklch(0.18 0.03 270)',
      popoverForeground: 'oklch(0.95 0.1 180)',
      primary: 'oklch(0.7 0.3 330)',
      primaryForeground: 'oklch(0.15 0.02 270)',
      secondary: 'oklch(0.65 0.25 180)',
      secondaryForeground: 'oklch(0.15 0.02 270)',
      muted: 'oklch(0.25 0.03 270)',
      mutedForeground: 'oklch(0.6 0.1 180)',
      accent: 'oklch(0.7 0.28 270)',
      accentForeground: 'oklch(0.15 0.02 270)',
      destructive: 'oklch(0.65 0.3 15)',
      border: 'oklch(0.3 0.1 270)',
      input: 'oklch(0.3 0.1 270)',
      ring: 'oklch(0.7 0.3 330)',
    },
  },
  nature: {
    name: '네이처',
    colors: {
      background: 'oklch(0.97 0.01 130)',
      foreground: 'oklch(0.25 0.03 130)',
      card: 'oklch(0.99 0.01 130)',
      cardForeground: 'oklch(0.25 0.03 130)',
      popover: 'oklch(0.99 0.01 130)',
      popoverForeground: 'oklch(0.25 0.03 130)',
      primary: 'oklch(0.5 0.15 145)',
      primaryForeground: 'oklch(0.99 0.01 130)',
      secondary: 'oklch(0.7 0.1 90)',
      secondaryForeground: 'oklch(0.25 0.03 130)',
      muted: 'oklch(0.92 0.02 130)',
      mutedForeground: 'oklch(0.5 0.05 130)',
      accent: 'oklch(0.75 0.12 160)',
      accentForeground: 'oklch(0.25 0.03 130)',
      destructive: 'oklch(0.6 0.18 40)',
      border: 'oklch(0.85 0.03 130)',
      input: 'oklch(0.85 0.03 130)',
      ring: 'oklch(0.5 0.15 145)',
    },
  },
  luxury: {
    name: '럭셔리',
    colors: {
      background: 'oklch(0.12 0.01 280)',
      foreground: 'oklch(0.95 0.02 60)',
      card: 'oklch(0.15 0.015 280)',
      cardForeground: 'oklch(0.95 0.02 60)',
      popover: 'oklch(0.15 0.015 280)',
      popoverForeground: 'oklch(0.95 0.02 60)',
      primary: 'oklch(0.75 0.15 60)',
      primaryForeground: 'oklch(0.12 0.01 280)',
      secondary: 'oklch(0.6 0.1 40)',
      secondaryForeground: 'oklch(0.95 0.02 60)',
      muted: 'oklch(0.2 0.02 280)',
      mutedForeground: 'oklch(0.65 0.03 60)',
      accent: 'oklch(0.65 0.12 350)',
      accentForeground: 'oklch(0.95 0.02 60)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.3 0.03 280)',
      input: 'oklch(0.3 0.03 280)',
      ring: 'oklch(0.75 0.15 60)',
    },
  },
};
