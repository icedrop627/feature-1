import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '../profiles';
import { mockProfiles } from '@/mocks/data/profiles';

// Mock the Supabase client module
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

describe('getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return profile with valid user ID', async () => {
    const mockProfile = mockProfiles[0];
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            }),
          })),
        })),
      })),
    });

    const result = await getProfile('user-1');

    expect(result.data).toEqual(mockProfile);
    expect(result.error).toBeNull();
  });

  it('should handle non-existent user ID', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'No rows found' }
            }),
          })),
        })),
      })),
    });

    const result = await getProfile('non-existent-user');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('PGRST116');
  });

  it('should handle invalid ID format', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Invalid ID format' }
            }),
          })),
        })),
      })),
    });

    const result = await getProfile('');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('should handle network error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Network error', code: 'NETWORK_ERROR' }
            }),
          })),
        })),
      })),
    });

    const result = await getProfile('user-1');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('NETWORK_ERROR');
  });
});

describe('updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update name only', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const updatedProfile = { ...mockProfiles[0], name: 'Updated Name' };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: updatedProfile,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('user-1', { name: 'Updated Name' });

    expect(result.data).toEqual(updatedProfile);
    expect(result.data?.name).toBe('Updated Name');
    expect(result.error).toBeNull();
  });

  it('should update bio only', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const updatedProfile = { ...mockProfiles[0], bio: 'Updated bio' };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: updatedProfile,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('user-1', { bio: 'Updated bio' });

    expect(result.data).toEqual(updatedProfile);
    expect(result.data?.bio).toBe('Updated bio');
    expect(result.error).toBeNull();
  });

  it('should update avatar_url only', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    const updatedProfile = { ...mockProfiles[0], avatar_url: newAvatarUrl };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: updatedProfile,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('user-1', { avatar_url: newAvatarUrl });

    expect(result.data).toEqual(updatedProfile);
    expect(result.data?.avatar_url).toBe(newAvatarUrl);
    expect(result.error).toBeNull();
  });

  it('should update multiple fields simultaneously', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const updates = {
      name: 'New Name',
      bio: 'New bio',
      avatar_url: 'https://example.com/new-avatar.jpg'
    };
    const updatedProfile = { ...mockProfiles[0], ...updates };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: updatedProfile,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('user-1', updates);

    expect(result.data).toEqual(updatedProfile);
    expect(result.data?.name).toBe('New Name');
    expect(result.data?.bio).toBe('New bio');
    expect(result.data?.avatar_url).toBe('https://example.com/new-avatar.jpg');
    expect(result.error).toBeNull();
  });

  it('should handle empty update object (no changes)', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const originalProfile = mockProfiles[0];

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: originalProfile,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('user-1', {});

    expect(result.data).toEqual(originalProfile);
    expect(result.error).toBeNull();
  });

  it('should handle non-existent user ID error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116', message: 'No rows found' }
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('non-existent', { name: 'Test' });

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('PGRST116');
  });

  it('should handle invalid data format error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Invalid data format', code: 'INVALID_DATA' }
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('user-1', { name: 'Test' });

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('INVALID_DATA');
  });

  it('should handle unauthorized user error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Unauthorized', code: '401' }
              }),
            })),
          })),
        })),
      })),
    });

    const result = await updateProfile('unauthorized-user', { name: 'Test' });

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('401');
  });
});

describe('uploadAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload JPG image successfully', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
    const mockPath = 'user-1/0.123.jpg';
    const mockUrl = `https://test.supabase.co/storage/v1/object/public/avatars/${mockPath}`;

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: { path: mockPath },
            error: null
          }),
          getPublicUrl: vi.fn(() => ({
            data: { publicUrl: mockUrl }
          })),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toEqual({
      path: mockPath,
      url: mockUrl
    });
    expect(result.error).toBeNull();
  });

  it('should upload PNG image successfully', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'avatar.png', { type: 'image/png' });
    const mockPath = 'user-1/0.123.png';
    const mockUrl = `https://test.supabase.co/storage/v1/object/public/avatars/${mockPath}`;

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: { path: mockPath },
            error: null
          }),
          getPublicUrl: vi.fn(() => ({
            data: { publicUrl: mockUrl }
          })),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toEqual({
      path: mockPath,
      url: mockUrl
    });
    expect(result.error).toBeNull();
  });

  it('should verify file path and URL returned', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockPath = 'user-2/0.456.jpg';
    const mockUrl = `https://test.supabase.co/storage/v1/object/public/avatars/${mockPath}`;

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: { path: mockPath },
            error: null
          }),
          getPublicUrl: vi.fn(() => ({
            data: { publicUrl: mockUrl }
          })),
        })),
      },
    });

    const result = await uploadAvatar('user-2', mockFile);

    expect(result.data?.path).toBe(mockPath);
    expect(result.data?.url).toBe(mockUrl);
    expect(result.data?.url).toContain('avatars');
    expect(result.error).toBeNull();
  });

  it('should include user ID in filename', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    const userId = 'user-123';

    let uploadedPath = '';
    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn((path: string) => {
            uploadedPath = path;
            return Promise.resolve({
              data: { path },
              error: null
            });
          }),
          getPublicUrl: vi.fn((path: string) => ({
            data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/avatars/${path}` }
          })),
        })),
      },
    });

    await uploadAvatar(userId, mockFile);

    expect(uploadedPath).toContain(userId);
    expect(uploadedPath).toMatch(new RegExp(`^${userId}/`));
  });

  it('should use upsert option to overwrite existing file', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });

    let upsertOption = false;
    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn((path: string, file: File, options: any) => {
            upsertOption = options?.upsert || false;
            return Promise.resolve({
              data: { path },
              error: null
            });
          }),
          getPublicUrl: vi.fn(() => ({
            data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/avatars/test.jpg' }
          })),
        })),
      },
    });

    await uploadAvatar('user-1', mockFile);

    expect(upsertOption).toBe(true);
  });

  it('should handle invalid file format error (PDF)', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Invalid file format' }
          }),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('should handle file size exceeded error', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'large.jpg', { type: 'image/jpeg' });

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'File size exceeds limit' }
          }),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.message).toContain('size');
  });

  it('should handle storage permission error', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Permission denied', code: '403' }
          }),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('403');
  });

  it('should handle network error', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Network error', code: 'NETWORK_ERROR' }
          }),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('NETWORK_ERROR');
  });

  it('should handle file without extension', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockFile = new File(['test'], 'avatar', { type: 'image/jpeg' });
    const mockPath = 'user-1/0.123.undefined';

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({
            data: { path: mockPath },
            error: null
          }),
          getPublicUrl: vi.fn(() => ({
            data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/avatars/${mockPath}` }
          })),
        })),
      },
    });

    const result = await uploadAvatar('user-1', mockFile);

    expect(result.data).toBeTruthy();
    expect(result.data?.path).toContain('undefined');
  });
});

describe('deleteAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete avatar successfully', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const avatarPath = 'user-1/avatar.jpg';

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
      },
    });

    const result = await deleteAvatar(avatarPath);

    expect(result.error).toBeNull();
  });

  it('should handle non-existent path', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'File not found', code: '404' }
          }),
        })),
      },
    });

    const result = await deleteAvatar('non-existent/path.jpg');

    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('404');
  });

  it('should handle storage permission error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Permission denied', code: '403' }
          }),
        })),
      },
    });

    const result = await deleteAvatar('user-1/avatar.jpg');

    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('403');
  });

  it('should handle network error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Network error', code: 'NETWORK_ERROR' }
          }),
        })),
      },
    });

    const result = await deleteAvatar('user-1/avatar.jpg');

    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('NETWORK_ERROR');
  });
});
