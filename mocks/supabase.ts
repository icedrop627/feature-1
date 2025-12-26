import { vi } from 'vitest';

// Mock data response helper
const createMockResponse = (data: any, error: any = null) => ({
  data,
  error,
});

// Mock select chain
const createSelectChain = (mockData: any) => ({
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  like: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  containedBy: vi.fn().mockReturnThis(),
  overlaps: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue(createMockResponse(mockData)),
  maybeSingle: vi.fn().mockResolvedValue(createMockResponse(mockData)),
  then: vi.fn((resolve) => resolve(createMockResponse(mockData))),
});

// Mock from chain
const createFromChain = (mockData: any = []) => ({
  select: vi.fn(() => createSelectChain(mockData)),
  insert: vi.fn().mockResolvedValue(createMockResponse(mockData)),
  update: vi.fn(() => ({
    eq: vi.fn().mockResolvedValue(createMockResponse(mockData)),
  })),
  delete: vi.fn(() => ({
    eq: vi.fn().mockResolvedValue(createMockResponse(null)),
  })),
  upsert: vi.fn().mockResolvedValue(createMockResponse(mockData)),
});

// Mock auth
const createAuthMock = () => ({
  signInWithPassword: vi.fn().mockResolvedValue(
    createMockResponse({
      user: { id: 'test-user-id', email: 'test@example.com' },
      session: { access_token: 'test-token' },
    })
  ),
  signUp: vi.fn().mockResolvedValue(
    createMockResponse({
      user: { id: 'new-user-id', email: 'newuser@example.com' },
      session: { access_token: 'new-token' },
    })
  ),
  signOut: vi.fn().mockResolvedValue(createMockResponse(null)),
  getUser: vi.fn().mockResolvedValue(
    createMockResponse({
      user: { id: 'test-user-id', email: 'test@example.com' },
    })
  ),
  getSession: vi.fn().mockResolvedValue(
    createMockResponse({
      session: { access_token: 'test-token' },
    })
  ),
  onAuthStateChange: vi.fn((callback) => {
    // Simulate initial auth state
    callback('SIGNED_IN', { access_token: 'test-token' });
    return {
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    };
  }),
});

// Mock storage
const createStorageMock = () => ({
  from: vi.fn((bucket: string) => ({
    upload: vi.fn().mockResolvedValue(
      createMockResponse({
        path: `${bucket}/test-file.jpg`,
      })
    ),
    download: vi.fn().mockResolvedValue(
      createMockResponse(new Blob(['test']))
    ),
    remove: vi.fn().mockResolvedValue(createMockResponse(null)),
    getPublicUrl: vi.fn((path: string) => ({
      data: {
        publicUrl: `https://test.supabase.co/storage/v1/object/public/${bucket}/${path}`,
      },
    })),
    list: vi.fn().mockResolvedValue(createMockResponse([])),
  })),
});

// Mock realtime channel
const createChannelMock = () => {
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn((callback) => {
      if (callback) callback('SUBSCRIBED');
      return mockChannel;
    }),
    unsubscribe: vi.fn().mockResolvedValue({ status: 'ok' }),
  };
  return mockChannel;
};

// Main Supabase client mock
export const createMockSupabaseClient = (customData?: any) => ({
  from: vi.fn((table: string) => createFromChain(customData?.[table])),
  auth: createAuthMock(),
  storage: createStorageMock(),
  channel: vi.fn((name: string) => createChannelMock()),
  removeChannel: vi.fn().mockResolvedValue({ status: 'ok' }),
  rpc: vi.fn().mockResolvedValue(createMockResponse(null)),
});

// Mock createClient function
export const createClient = vi.fn(() => createMockSupabaseClient());

// Export commonly used mocks
export const mockSupabaseClient = createMockSupabaseClient();
