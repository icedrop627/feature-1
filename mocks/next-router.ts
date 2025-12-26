import { vi } from 'vitest';

// Mock useRouter
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

export const useRouter = vi.fn(() => mockRouter);

// Mock usePathname
export const usePathname = vi.fn(() => '/');

// Mock useSearchParams
export const mockSearchParams = new URLSearchParams();
export const useSearchParams = vi.fn(() => mockSearchParams);

// Mock redirect
export const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT: ${url}`);
});

// Mock useParams
export const useParams = vi.fn(() => ({}));
