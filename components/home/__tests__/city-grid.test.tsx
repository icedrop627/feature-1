import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CityGrid } from '../city-grid';
import type { City, FilterState } from '@/lib/types';

// Mock the CityCard component
vi.mock('../city-card', () => ({
  CityCard: ({ city }: { city: City }) => (
    <div data-testid={`city-card-${city.id}`}>
      <h3>{city.name_ko}</h3>
      <p>{city.name_en}</p>
      <span>Cost: {city.monthly_cost}</span>
      <span>Likes: {city.likes}</span>
    </div>
  ),
}));

describe('CityGrid', () => {
  // Mock city data with diverse attributes
  const mockCities: City[] = [
    {
      id: '1',
      name_ko: '서울',
      name_en: 'Seoul',
      description: '대한민국의 수도',
      cover_image: null,
      monthly_cost: 2500000,
      likes: 150,
      dislikes: 10,
      budget: '200만원 이상',
      region: '수도권',
      environment: ['도심선호', '코워킹 필수'],
      best_season: ['봄', '가을'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name_ko: '부산',
      name_en: 'Busan',
      description: '해운대가 있는 항구도시',
      cover_image: null,
      monthly_cost: 1800000,
      likes: 120,
      dislikes: 5,
      budget: '100~200만원',
      region: '경상도',
      environment: ['자연친화', '카페작업'],
      best_season: ['여름', '가을'],
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
    {
      id: '3',
      name_ko: '제주',
      name_en: 'Jeju',
      description: '아름다운 섬',
      cover_image: null,
      monthly_cost: 1500000,
      likes: 200,
      dislikes: 8,
      budget: '100~200만원',
      region: '제주도',
      environment: ['자연친화'],
      best_season: ['봄', '여름', '가을'],
      created_at: '2024-01-03',
      updated_at: '2024-01-03',
    },
    {
      id: '4',
      name_ko: '강릉',
      name_en: 'Gangneung',
      description: '커피의 도시',
      cover_image: null,
      monthly_cost: 1200000,
      likes: 80,
      dislikes: 3,
      budget: '100~200만원',
      region: '강원도',
      environment: ['자연친화', '카페작업'],
      best_season: ['여름', '겨울'],
      created_at: '2024-01-04',
      updated_at: '2024-01-04',
    },
    {
      id: '5',
      name_ko: '전주',
      name_en: 'Jeonju',
      description: '한옥마을',
      cover_image: null,
      monthly_cost: 900000,
      likes: 60,
      dislikes: 2,
      budget: '100만원 이하',
      region: '전라도',
      environment: ['도심선호', '카페작업'],
      best_season: ['봄', '가을'],
      created_at: '2024-01-05',
      updated_at: '2024-01-05',
    },
    {
      id: '6',
      name_ko: '대전',
      name_en: 'Daejeon',
      description: '과학의 도시',
      cover_image: null,
      monthly_cost: 1400000,
      likes: 70,
      dislikes: 4,
      budget: '100~200만원',
      region: '충청도',
      environment: ['코워킹 필수', '도심선호'],
      best_season: ['봄', '가을'],
      created_at: '2024-01-06',
      updated_at: '2024-01-06',
    },
  ];

  const defaultFilters: FilterState = {
    searchQuery: '',
    budget: '전체',
    regions: [],
    environment: [],
    bestSeason: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Rendering Tests (6 tests)
  // ============================================

  describe('Rendering Tests', () => {
    it('should render city list grid with heading', () => {
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      const heading = screen.getByRole('heading', { name: '도시 리스트' });
      expect(heading).toBeInTheDocument();
    });

    it('should display city count', () => {
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      const countText = screen.getByText('6개의 도시를 찾았습니다');
      expect(countText).toBeInTheDocument();
    });

    it('should render Sort Select component', () => {
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      const sortSelect = screen.getByRole('combobox');
      expect(sortSelect).toBeInTheDocument();
    });

    it('should show empty results message when no cities', () => {
      const emptyFilters: FilterState = {
        ...defaultFilters,
        searchQuery: 'NonexistentCity',
      };

      render(<CityGrid cities={mockCities} filters={emptyFilters} />);

      const emptyMessage = screen.getByText('검색 결과가 없습니다.');
      expect(emptyMessage).toBeInTheDocument();
    });

    it('should verify grid layout structure', () => {
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      // Find the grid container
      const containers = screen.getAllByRole('generic');
      const gridContainer = containers.find(el =>
        el.className.includes('grid') &&
        el.className.includes('gap-6')
      );

      expect(gridContainer).toBeInTheDocument();
    });

    it('should render CityCard components for each city', () => {
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      mockCities.forEach(city => {
        const cityCard = screen.getByTestId(`city-card-${city.id}`);
        expect(cityCard).toBeInTheDocument();
        expect(within(cityCard).getByText(city.name_ko)).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // Filtering Tests (10 tests)
  // ============================================

  describe('Filtering Tests', () => {
    it('should filter cities by Korean search query', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: '서울',
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      expect(screen.getByTestId('city-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-2')).not.toBeInTheDocument();
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should filter cities by English search query', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'busan',
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      expect(screen.getByTestId('city-card-2')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-1')).not.toBeInTheDocument();
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should filter cities by budget', () => {
      const filters: FilterState = {
        ...defaultFilters,
        budget: '100만원 이하',
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      // Only 전주 has budget '100만원 이하'
      expect(screen.getByTestId('city-card-5')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-1')).not.toBeInTheDocument();
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should filter cities by single region', () => {
      const filters: FilterState = {
        ...defaultFilters,
        regions: ['제주도'],
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      expect(screen.getByTestId('city-card-3')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-1')).not.toBeInTheDocument();
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should filter cities by multiple regions', () => {
      const filters: FilterState = {
        ...defaultFilters,
        regions: ['수도권', '경상도'],
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      // Should show 서울 (수도권) and 부산 (경상도)
      expect(screen.getByTestId('city-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('city-card-2')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-3')).not.toBeInTheDocument();
      expect(screen.getByText('2개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should filter cities by environment with OR condition', () => {
      const filters: FilterState = {
        ...defaultFilters,
        environment: ['자연친화'],
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      // Cities with '자연친화': 부산, 제주, 강릉
      expect(screen.getByTestId('city-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('city-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('city-card-4')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-1')).not.toBeInTheDocument();
      expect(screen.getByText('3개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should filter cities by season with OR condition', () => {
      const filters: FilterState = {
        ...defaultFilters,
        bestSeason: ['겨울'],
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      // Only 강릉 has '겨울'
      expect(screen.getByTestId('city-card-4')).toBeInTheDocument();
      expect(screen.queryByTestId('city-card-1')).not.toBeInTheDocument();
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should apply combined filters correctly', () => {
      const filters: FilterState = {
        searchQuery: '강',
        budget: '100~200만원',
        regions: ['강원도'],
        environment: ['카페작업'],
        bestSeason: ['여름'],
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      // Should match 강릉 (contains '강', budget matches, region matches, has 카페작업, has 여름)
      expect(screen.getByTestId('city-card-4')).toBeInTheDocument();
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should show no results message when filters match nothing', () => {
      const filters: FilterState = {
        ...defaultFilters,
        budget: '100만원 이하',
        regions: ['제주도'], // 전주 is 100만원 이하 but not in 제주도
      };

      render(<CityGrid cities={mockCities} filters={filters} />);

      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
      expect(screen.getByText('0개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should update filtered results in real-time when filters change', () => {
      const { rerender } = render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      // Initially all cities shown
      expect(screen.getByText('6개의 도시를 찾았습니다')).toBeInTheDocument();

      // Apply filter
      const newFilters: FilterState = {
        ...defaultFilters,
        regions: ['전라도'],
      };

      rerender(<CityGrid cities={mockCities} filters={newFilters} />);

      // Now only 전주 shown
      expect(screen.getByText('1개의 도시를 찾았습니다')).toBeInTheDocument();
      expect(screen.getByTestId('city-card-5')).toBeInTheDocument();
    });
  });

  // ============================================
  // Sorting Tests (4 tests)
  // ============================================

  describe('Sorting Tests', () => {
    it('should sort by likes in descending order by default', () => {
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      const cityCards = screen.getAllByTestId(/city-card-/);

      // 제주 (200 likes) should be first, 전주 (60 likes) should be last
      expect(cityCards[0]).toHaveAttribute('data-testid', 'city-card-3'); // 제주
      expect(cityCards[cityCards.length - 1]).toHaveAttribute('data-testid', 'city-card-5'); // 전주
    });

    it('should sort by cost in ascending order when selected', async () => {
      const user = userEvent.setup();
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);

      const costLowOption = screen.getByRole('option', { name: '생활비 낮은순' });
      await user.click(costLowOption);

      const cityCards = screen.getAllByTestId(/city-card-/);

      // 전주 (900,000) should be first, 서울 (2,500,000) should be last
      expect(cityCards[0]).toHaveAttribute('data-testid', 'city-card-5'); // 전주
      expect(cityCards[cityCards.length - 1]).toHaveAttribute('data-testid', 'city-card-1'); // 서울
    });

    it('should sort by cost in descending order when selected', async () => {
      const user = userEvent.setup();
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);

      const costHighOption = screen.getByRole('option', { name: '생활비 높은순' });
      await user.click(costHighOption);

      const cityCards = screen.getAllByTestId(/city-card-/);

      // 서울 (2,500,000) should be first, 전주 (900,000) should be last
      expect(cityCards[0]).toHaveAttribute('data-testid', 'city-card-1'); // 서울
      expect(cityCards[cityCards.length - 1]).toHaveAttribute('data-testid', 'city-card-5'); // 전주
    });

    it('should reflect sort change immediately in grid', async () => {
      const user = userEvent.setup();
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      let cityCards = screen.getAllByTestId(/city-card-/);
      const firstCardBefore = cityCards[0];

      // Change sort
      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);
      await user.click(screen.getByRole('option', { name: '생활비 낮은순' }));

      cityCards = screen.getAllByTestId(/city-card-/);
      const firstCardAfter = cityCards[0];

      // First card should be different after sort change
      expect(firstCardBefore).not.toEqual(firstCardAfter);
    });
  });

  // ============================================
  // useMemo Optimization Tests (3 tests)
  // ============================================

  describe('useMemo Optimization Tests', () => {
    it('should recalculate filtered cities only when filters change', () => {
      const { rerender } = render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      // Get initial city cards count
      let cityCards = screen.getAllByTestId(/city-card-/);
      expect(cityCards.length).toBe(6);

      // Rerender with same props - should use memoized value
      rerender(<CityGrid cities={mockCities} filters={defaultFilters} />);
      cityCards = screen.getAllByTestId(/city-card-/);
      expect(cityCards.length).toBe(6);

      // Change filters - should recalculate
      const newFilters: FilterState = {
        ...defaultFilters,
        budget: '100만원 이하',
      };
      rerender(<CityGrid cities={mockCities} filters={newFilters} />);
      cityCards = screen.getAllByTestId(/city-card-/);
      expect(cityCards.length).toBe(1);
    });

    it('should recalculate when cities prop changes', () => {
      const { rerender } = render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      let cityCards = screen.getAllByTestId(/city-card-/);
      expect(cityCards.length).toBe(6);

      // Change cities array
      const reducedCities = mockCities.slice(0, 3);
      rerender(<CityGrid cities={reducedCities} filters={defaultFilters} />);

      cityCards = screen.getAllByTestId(/city-card-/);
      expect(cityCards.length).toBe(3);
      expect(screen.getByText('3개의 도시를 찾았습니다')).toBeInTheDocument();
    });

    it('should recalculate when sortBy changes', async () => {
      const user = userEvent.setup();
      render(<CityGrid cities={mockCities} filters={defaultFilters} />);

      let cityCards = screen.getAllByTestId(/city-card-/);
      const firstCardBeforeSort = cityCards[0].getAttribute('data-testid');

      // 제주 should be first (most likes: 200)
      expect(firstCardBeforeSort).toBe('city-card-3');

      // Change sort to cost_low
      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);
      await user.click(screen.getByRole('option', { name: '생활비 낮은순' }));

      cityCards = screen.getAllByTestId(/city-card-/);
      const firstCardAfterSort = cityCards[0].getAttribute('data-testid');

      // 전주 should be first (lowest cost: 900,000)
      expect(firstCardAfterSort).toBe('city-card-5');
      expect(firstCardBeforeSort).not.toBe(firstCardAfterSort);
    });
  });
});
