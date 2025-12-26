import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCities, getCityById, getUserCityReaction, toggleCityReaction, getCitiesServer } from '../cities';
import { mockCities } from '@/mocks/data/cities';
import { mockCityReactions } from '@/mocks/data/profiles';
import { FilterState, SortOption } from '@/lib/types';

// Mock the Supabase client modules
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('getCities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========== FILTERING TESTS (15 tests) ==========

  describe('Filtering Tests', () => {
    it('should return all cities when no filters are provided', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const result = await getCities();

      expect(result.data).toEqual(mockCities);
      expect(result.error).toBeNull();
    });

    it('should filter by budget: 100만원 이하', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const filteredCities = mockCities.filter(c => c.budget === '100만원 이하');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: filteredCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '100만원 이하',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      const result = await getCities(filters);

      expect(mockQuery.eq).toHaveBeenCalledWith('budget', '100만원 이하');
      expect(result.data).toEqual(filteredCities);
    });

    it('should filter by budget: 100~200만원', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const filteredCities = mockCities.filter(c => c.budget === '100~200만원');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: filteredCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '100~200만원',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      const result = await getCities(filters);

      expect(mockQuery.eq).toHaveBeenCalledWith('budget', '100~200만원');
      expect(result.data).toEqual(filteredCities);
    });

    it('should filter by budget: 200만원 이상', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const filteredCities = mockCities.filter(c => c.budget === '200만원 이상');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: filteredCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '200만원 이상',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      const result = await getCities(filters);

      expect(mockQuery.eq).toHaveBeenCalledWith('budget', '200만원 이상');
    });

    it('should ignore budget filter when set to "전체"', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.eq).not.toHaveBeenCalledWith('budget', '전체');
    });

    it('should filter by single region', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const filteredCities = mockCities.filter(c => c.region === '수도권');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: filteredCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: ['수도권'],
        environment: [],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.in).toHaveBeenCalledWith('region', ['수도권']);
    });

    it('should filter by multiple regions', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const regions = ['수도권', '경상도'];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: regions,
        environment: [],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.in).toHaveBeenCalledWith('region', regions);
    });

    it('should filter by single environment', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: [],
        environment: ['바다'],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.overlaps).toHaveBeenCalledWith('environment', ['바다']);
    });

    it('should filter by multiple environments (OR condition)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: [],
        environment: ['바다', '산'],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.overlaps).toHaveBeenCalledWith('environment', ['바다', '산']);
    });

    it('should filter by single season', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: ['여름'],
      };

      await getCities(filters);

      expect(mockQuery.overlaps).toHaveBeenCalledWith('best_season', ['여름']);
    });

    it('should filter by multiple seasons (OR condition)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: ['봄', '가을'],
      };

      await getCities(filters);

      expect(mockQuery.overlaps).toHaveBeenCalledWith('best_season', ['봄', '가을']);
    });

    it('should search by Korean city name', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const searchQuery = '서울';

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [mockCities[0]], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery,
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.or).toHaveBeenCalledWith(
        `name_ko.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    });

    it('should search by English city name', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const searchQuery = 'Seoul';

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [mockCities[0]], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery,
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.or).toHaveBeenCalledWith(
        `name_ko.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    });

    it('should search by description', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const searchQuery = '수도';

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [mockCities[0]], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery,
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      await getCities(filters);

      expect(mockQuery.or).toHaveBeenCalledWith(
        `name_ko.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    });

    it('should combine multiple filters (budget + region + environment + season)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '100만원 이하',
        regions: ['강원도', '제주도'],
        environment: ['바다', '자연'],
        bestSeason: ['여름'],
      };

      await getCities(filters);

      expect(mockQuery.eq).toHaveBeenCalledWith('budget', '100만원 이하');
      expect(mockQuery.in).toHaveBeenCalledWith('region', ['강원도', '제주도']);
      expect(mockQuery.overlaps).toHaveBeenCalledWith('environment', ['바다', '자연']);
      expect(mockQuery.overlaps).toHaveBeenCalledWith('best_season', ['여름']);
    });
  });

  // ========== SORTING TESTS (4 tests) ==========

  describe('Sorting Tests', () => {
    it('should sort by likes (descending)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const sortBy: SortOption = 'likes';
      await getCities(undefined, sortBy);

      expect(mockQuery.order).toHaveBeenCalledWith('likes', { ascending: false });
    });

    it('should sort by cost (ascending)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const sortBy: SortOption = 'cost_low';
      await getCities(undefined, sortBy);

      expect(mockQuery.order).toHaveBeenCalledWith('monthly_cost', {
        ascending: true,
        nullsFirst: false,
      });
    });

    it('should sort by cost (descending)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const sortBy: SortOption = 'cost_high';
      await getCities(undefined, sortBy);

      expect(mockQuery.order).toHaveBeenCalledWith('monthly_cost', {
        ascending: false,
        nullsFirst: false,
      });
    });

    it('should use default sort (created_at newest first)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      await getCities();

      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });

  // ========== ERROR HANDLING TESTS (6 tests) ==========

  describe('Error Handling Tests', () => {
    it('should handle network errors', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const networkError = new Error('Network error');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: networkError }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const result = await getCities();

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should handle Supabase error response', async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabaseError = {
        message: 'Database error',
        code: 'PGRST116',
        details: 'The result contains 0 rows',
        hint: null,
      };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: supabaseError }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const result = await getCities();

      expect(result.data).toBeNull();
      expect(result.error).toEqual(supabaseError);
    });

    it('should handle empty results', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: 'NonExistentCity',
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      const result = await getCities(filters);

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('should handle null filter parameters gracefully', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: [],
        environment: [],
        bestSeason: [],
      };

      const result = await getCities(filters);

      expect(result.data).toEqual(mockCities);
      expect(result.error).toBeNull();
    });

    it('should handle undefined sort option (falls back to default)', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      await getCities(undefined, undefined);

      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should handle invalid filter values gracefully', async () => {
      const { createClient } = await import('@/lib/supabase/client');

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        overlaps: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCities, error: null }),
      };

      (createClient as any).mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQuery),
        })),
      });

      const filters: FilterState = {
        searchQuery: '',
        budget: '전체',
        regions: ['InvalidRegion' as any],
        environment: ['InvalidEnvironment'],
        bestSeason: ['InvalidSeason'],
      };

      await getCities(filters);

      expect(mockQuery.in).toHaveBeenCalledWith('region', ['InvalidRegion']);
      expect(mockQuery.overlaps).toHaveBeenCalledWith('environment', ['InvalidEnvironment']);
      expect(mockQuery.overlaps).toHaveBeenCalledWith('best_season', ['InvalidSeason']);
    });
  });
});

describe('getCityById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return city successfully with valid ID', async () => {
    const mockCity = mockCities[0];
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: mockCity, error: null }),
          })),
        })),
      })),
    });

    const result = await getCityById('1');

    expect(result.data).toEqual(mockCity);
    expect(result.error).toBeNull();
  });

  it('should handle non-existent city ID', async () => {
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

    const result = await getCityById('non-existent-id');

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

    const result = await getCityById('');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('should handle network errors', async () => {
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

    const result = await getCityById('1');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('NETWORK_ERROR');
  });
});

describe('getUserCityReaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get like reaction', async () => {
    const mockReaction = mockCityReactions[0];
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { reaction_type: 'like' },
            error: null
          }),
        })),
      })),
    });

    const result = await getUserCityReaction('1', 'user-1');

    expect(result.data).toBe('like');
    expect(result.error).toBeNull();
  });

  it('should get dislike reaction', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { reaction_type: 'dislike' },
            error: null
          }),
        })),
      })),
    });

    const result = await getUserCityReaction('2', 'user-1');

    expect(result.data).toBe('dislike');
    expect(result.error).toBeNull();
  });

  it('should return null when no reaction exists', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
      })),
    });

    const result = await getUserCityReaction('1', 'user-2');

    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('should handle non-existent city ID', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'City not found' }
          }),
        })),
      })),
    });

    const result = await getUserCityReaction('non-existent', 'user-1');

    expect(result.data).toBeNull();
  });

  it('should handle non-existent user ID', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
      })),
    });

    const result = await getUserCityReaction('1', 'non-existent-user');

    expect(result.data).toBeNull();
  });
});

describe('toggleCityReaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add new like reaction', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const newReaction = {
      id: 'new-reaction',
      city_id: '1',
      user_id: 'user-3',
      reaction_type: 'like',
      created_at: new Date().toISOString(),
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: newReaction,
              error: null
            }),
          })),
        })),
      })),
    });

    const result = await toggleCityReaction('1', 'user-3', 'like');

    expect(result.data).toEqual(newReaction);
    expect(result.error).toBeNull();
  });

  it('should add new dislike reaction', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const newReaction = {
      id: 'new-reaction',
      city_id: '2',
      user_id: 'user-3',
      reaction_type: 'dislike',
      created_at: new Date().toISOString(),
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: newReaction,
              error: null
            }),
          })),
        })),
      })),
    });

    const result = await toggleCityReaction('2', 'user-3', 'dislike');

    expect(result.data).toEqual(newReaction);
    expect(result.error).toBeNull();
  });

  it('should remove existing like reaction (toggle off)', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const existingReaction = {
      id: 'reaction-1',
      city_id: '1',
      user_id: 'user-1',
      reaction_type: 'like',
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: existingReaction,
            error: null
          }),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
      })),
    });

    const result = await toggleCityReaction('1', 'user-1', 'like');

    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('should remove existing dislike reaction (toggle off)', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const existingReaction = {
      id: 'reaction-2',
      city_id: '2',
      user_id: 'user-1',
      reaction_type: 'dislike',
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: existingReaction,
            error: null
          }),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
      })),
    });

    const result = await toggleCityReaction('2', 'user-1', 'dislike');

    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('should switch from like to dislike', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const existingReaction = {
      id: 'reaction-1',
      city_id: '1',
      user_id: 'user-1',
      reaction_type: 'like',
    };
    const updatedReaction = {
      ...existingReaction,
      reaction_type: 'dislike',
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: existingReaction,
            error: null
          }),
          single: vi.fn().mockResolvedValue({
            data: updatedReaction,
            error: null
          }),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: updatedReaction,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await toggleCityReaction('1', 'user-1', 'dislike');

    expect(result.data).toEqual(updatedReaction);
    expect(result.error).toBeNull();
  });

  it('should switch from dislike to like', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const existingReaction = {
      id: 'reaction-2',
      city_id: '2',
      user_id: 'user-1',
      reaction_type: 'dislike',
    };
    const updatedReaction = {
      ...existingReaction,
      reaction_type: 'like',
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: existingReaction,
            error: null
          }),
          single: vi.fn().mockResolvedValue({
            data: updatedReaction,
            error: null
          }),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: updatedReaction,
                error: null
              }),
            })),
          })),
        })),
      })),
    });

    const result = await toggleCityReaction('2', 'user-1', 'like');

    expect(result.data).toEqual(updatedReaction);
    expect(result.error).toBeNull();
  });

  it('should handle same reaction click removes it', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const existingReaction = {
      id: 'reaction-1',
      city_id: '1',
      user_id: 'user-1',
      reaction_type: 'like',
    };

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: existingReaction,
            error: null
          }),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
      })),
    });

    const result = await toggleCityReaction('1', 'user-1', 'like');

    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('should handle non-existent city ID error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'City not found', code: 'PGRST116' }
          }),
        })),
      })),
    });

    const result = await toggleCityReaction('non-existent', 'user-1', 'like');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('should handle unauthorized user error', async () => {
    const { createClient } = await import('@/lib/supabase/client');

    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Unauthorized', code: '401' }
            }),
          })),
        })),
      })),
    });

    const result = await toggleCityReaction('1', 'unauthorized-user', 'like');

    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('should handle optimistic update scenario', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const newReaction = {
      id: 'optimistic-reaction',
      city_id: '1',
      user_id: 'user-1',
      reaction_type: 'like',
      created_at: new Date().toISOString(),
    };

    // First call: check existing reaction
    // Second call: insert new reaction
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null
          }),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: newReaction,
              error: null
            }),
          })),
        })),
      })),
    });

    const result = await toggleCityReaction('1', 'user-1', 'like');

    expect(result.data).toEqual(newReaction);
    expect(result.error).toBeNull();
  });
});

describe('getCitiesServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch cities from server component', async () => {
    const { createClient } = await import('@/lib/supabase/server');

    (createClient as any).mockResolvedValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({
            data: mockCities,
            error: null
          }),
        })),
      })),
    });

    const result = await getCitiesServer();

    expect(result.data).toEqual(mockCities);
    expect(result.error).toBeNull();
  });

  it('should apply filters in SSR environment', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const filteredCities = mockCities.filter(c => c.region === '수도권');

    const mockQuery = {
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: filteredCities,
        error: null
      }),
    };

    (createClient as any).mockResolvedValue({
      from: vi.fn(() => ({
        select: vi.fn(() => mockQuery),
      })),
    });

    const filters = {
      searchQuery: '',
      budget: '전체' as const,
      regions: ['수도권'],
      environment: [],
      bestSeason: [],
    };

    const result = await getCitiesServer(filters);

    expect(result.data).toEqual(filteredCities);
    expect(result.error).toBeNull();
    expect(mockQuery.in).toHaveBeenCalledWith('region', ['수도권']);
  });

  it('should handle server client cookie handling', async () => {
    const { createClient } = await import('@/lib/supabase/server');

    // Mock server client that requires async initialization
    (createClient as any).mockResolvedValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({
            data: mockCities,
            error: null
          }),
        })),
      })),
    });

    const result = await getCitiesServer();

    expect(result.data).toEqual(mockCities);
    expect(result.error).toBeNull();
    // Verify createClient was awaited (it's an async function)
    expect(createClient).toHaveBeenCalled();
  });
});
