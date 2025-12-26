import { vi } from 'vitest';

// Mock theme state
let currentTheme = 'light';

// Mock useTheme hook
export const mockUseTheme = {
  theme: currentTheme,
  setTheme: vi.fn((theme: string) => {
    currentTheme = theme;
    mockUseTheme.theme = theme;
  }),
  systemTheme: 'light',
  themes: ['light', 'dark'],
  resolvedTheme: currentTheme,
};

export const useTheme = vi.fn(() => mockUseTheme);

// Reset function for tests
export const resetTheme = () => {
  currentTheme = 'light';
  mockUseTheme.theme = 'light';
  mockUseTheme.resolvedTheme = 'light';
  mockUseTheme.setTheme.mockClear();
};
