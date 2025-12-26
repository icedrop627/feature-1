import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware, config } from '@/middleware';
import { createServerClient } from '@supabase/ssr';

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

// Mock NextResponse
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server');
  return {
    ...actual,
    NextResponse: {
      next: vi.fn((init?: any) => {
        const response = {
          cookies: {
            set: vi.fn(),
            getAll: vi.fn(() => []),
            setAll: vi.fn(),
          },
        };
        return response;
      }),
      redirect: vi.fn((url: string | URL) => ({
        url: typeof url === 'string' ? url : url.toString(),
        status: 307,
        cookies: {
          set: vi.fn(),
          getAll: vi.fn(() => []),
        },
      })),
    },
  };
});

describe('Middleware', () => {
  let mockSupabase: any;
  let mockRequest: NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup Supabase mock
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
    };

    (createServerClient as any).mockReturnValue(mockSupabase);
  });

  const createMockRequest = (pathname: string, cookies: any[] = []) => {
    const url = `http://localhost:3000${pathname}`;
    const request = {
      nextUrl: new URL(url),
      url,
      cookies: {
        getAll: vi.fn(() => cookies),
        set: vi.fn(),
      },
    } as unknown as NextRequest;

    return request;
  };

  describe('Authentication Check Tests', () => {
    it('should require authentication for protected routes', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      mockRequest = createMockRequest('/profile');
      const response = await middleware(mockRequest);

      expect(response).toBeDefined();
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should redirect unauthenticated user to login when accessing protected route', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      mockRequest = createMockRequest('/profile');
      const response = await middleware(mockRequest);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectCall.pathname).toBe('/login');
    });

    it('should add redirectTo query parameter on redirect from protected route', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      mockRequest = createMockRequest('/profile/settings');
      const response = await middleware(mockRequest);

      const redirectCall = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectCall.searchParams.get('redirectTo')).toBe('/profile/settings');
    });

    it('should allow authenticated user to access protected route', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
        },
        error: null,
      });

      mockRequest = createMockRequest('/profile');
      const response = await middleware(mockRequest);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should redirect logged-in user accessing /login to home', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
        },
        error: null,
      });

      mockRequest = createMockRequest('/login');
      const response = await middleware(mockRequest);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectCall.pathname).toBe('/');
    });

    it('should redirect logged-in user accessing /register to home', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
        },
        error: null,
      });

      mockRequest = createMockRequest('/register');
      const response = await middleware(mockRequest);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectCall.pathname).toBe('/');
    });

    it('should allow public routes to be accessible without authentication', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      mockRequest = createMockRequest('/');
      const response = await middleware(mockRequest);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should handle Supabase cookies correctly', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
        },
        error: null,
      });

      const mockCookies = [
        { name: 'sb-auth-token', value: 'token123', options: {} },
      ];

      mockRequest = createMockRequest('/', mockCookies);
      await middleware(mockRequest);

      expect(createServerClient).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function),
          }),
        })
      );
    });
  });

  describe('Route Matching Tests', () => {
    it('should ignore static files (_next/static)', () => {
      // Verify that config.matcher exists and has the negative lookahead pattern
      expect(config.matcher).toBeDefined();
      expect(config.matcher[0]).toContain('_next/static');

      // The pattern uses negative lookahead to exclude _next/static
      const pattern = config.matcher[0];
      expect(pattern).toMatch(/_next\/static/);
    });

    it('should ignore image optimization files (_next/image)', () => {
      // Verify that config.matcher exists and has the negative lookahead pattern
      expect(config.matcher).toBeDefined();
      expect(config.matcher[0]).toContain('_next/image');

      // The pattern uses negative lookahead to exclude _next/image
      const pattern = config.matcher[0];
      expect(pattern).toMatch(/_next\/image/);
    });

    it('should ignore favicon.ico', () => {
      // Verify that config.matcher exists and has the negative lookahead pattern
      expect(config.matcher).toBeDefined();
      expect(config.matcher[0]).toContain('favicon.ico');

      // The pattern uses negative lookahead to exclude favicon.ico
      const pattern = config.matcher[0];
      expect(pattern).toMatch(/favicon\.ico/);
    });

    it('should ignore image files (svg, png, jpg, etc.)', () => {
      // Verify that config.matcher exists and has the negative lookahead pattern
      expect(config.matcher).toBeDefined();

      const pattern = config.matcher[0];
      // Check that the pattern includes the image extensions regex
      expect(pattern).toMatch(/svg|png|jpg|jpeg|gif|webp/);
    });

    it('should match /profile route as protected', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      mockRequest = createMockRequest('/profile');
      await middleware(mockRequest);

      // Should redirect because it's protected and user is not authenticated
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should match /settings route as protected', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      mockRequest = createMockRequest('/settings');
      await middleware(mockRequest);

      // Should redirect because it's protected and user is not authenticated
      expect(NextResponse.redirect).toHaveBeenCalled();
    });
  });
});
