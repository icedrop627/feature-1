import { http, HttpResponse } from 'msw';
import { mockCities, getCityById } from './data/cities';
import { mockProfiles, getMockProfileById } from './data/profiles';
import { mockUsers, getMockUserByEmail } from './data/users';

// Supabase project URL (mock)
const SUPABASE_URL = 'https://test.supabase.co';

export const handlers = [
  // GET /rest/v1/cities - Get all cities
  http.get(`${SUPABASE_URL}/rest/v1/cities`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    // Check if filtering by id
    if (idParam) {
      const match = idParam.match(/eq\.(.+)/);
      if (match) {
        const id = match[1];
        const city = getCityById(id);
        return HttpResponse.json(city ? [city] : []);
      }
    }

    return HttpResponse.json(mockCities);
  }),

  // GET /rest/v1/cities with single item
  http.get(`${SUPABASE_URL}/rest/v1/cities`, ({ request }) => {
    const url = new URL(request.url);
    const select = url.searchParams.get('select');

    // Handle single() queries
    if (select) {
      return HttpResponse.json(mockCities[0]);
    }

    return HttpResponse.json(mockCities);
  }),

  // POST /rest/v1/city_reactions - Create city reaction
  http.post(`${SUPABASE_URL}/rest/v1/city_reactions`, async ({ request }) => {
    const body = await request.json();

    const reaction = {
      id: `reaction-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...body,
    };

    return HttpResponse.json(reaction, { status: 201 });
  }),

  // GET /rest/v1/profiles - Get profiles
  http.get(`${SUPABASE_URL}/rest/v1/profiles`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    if (idParam) {
      const match = idParam.match(/eq\.(.+)/);
      if (match) {
        const id = match[1];
        const profile = getMockProfileById(id);
        return HttpResponse.json(profile ? [profile] : []);
      }
    }

    return HttpResponse.json(mockProfiles);
  }),

  // POST /auth/v1/signup - Sign up
  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    const newUser = {
      id: `user-${Date.now()}`,
      email: body.email,
      created_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
    };

    const session = {
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      expires_in: 3600,
      token_type: 'bearer',
      user: newUser,
    };

    return HttpResponse.json({
      user: newUser,
      session,
    });
  }),

  // POST /auth/v1/token?grant_type=password - Sign in
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const url = new URL(request.url);
    const grantType = url.searchParams.get('grant_type');

    if (grantType === 'password') {
      const body = await request.json() as { email: string; password: string };
      const user = getMockUserByEmail(body.email);

      if (!user || user.password !== body.password) {
        return HttpResponse.json(
          { error: 'Invalid credentials' },
          { status: 400 }
        );
      }

      const authUser = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        aud: 'authenticated',
        role: 'authenticated',
      };

      const session = {
        access_token: `mock-token-${user.id}`,
        refresh_token: `mock-refresh-${user.id}`,
        expires_in: 3600,
        token_type: 'bearer',
        user: authUser,
      };

      return HttpResponse.json({
        user: authUser,
        session,
      });
    }

    return HttpResponse.json(
      { error: 'Unsupported grant type' },
      { status: 400 }
    );
  }),

  // GET /auth/v1/user - Get current user
  http.get(`${SUPABASE_URL}/auth/v1/user`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    // Return mock user
    return HttpResponse.json({
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
      aud: 'authenticated',
      role: 'authenticated',
    });
  }),

  // POST /auth/v1/logout - Sign out
  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return HttpResponse.json({}, { status: 204 });
  }),
];
