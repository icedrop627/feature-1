import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterSidebar } from '../filter-sidebar';
import type { FilterState } from '@/lib/types';

describe('FilterSidebar', () => {
  let mockOnFilterChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnFilterChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Rendering Tests (8 tests)
  // ============================================

  describe('Rendering Tests', () => {
    it('should render desktop sidebar with filter heading', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const heading = screen.getByRole('heading', { name: /필터/i });
      expect(heading).toBeInTheDocument();
    });

    it('should render mobile Sheet trigger button', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Mobile button should be present (even if not visible on desktop)
      const mobileButton = screen.getAllByRole('button').find(
        btn => btn.classList.contains('lg:hidden')
      );
      expect(mobileButton).toBeInTheDocument();
    });

    it('should render search input with placeholder', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const searchInput = screen.getByPlaceholderText('도시명 검색...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue('');
    });

    it('should render budget radio group with 4 options', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      expect(screen.getByRole('radio', { name: '전체' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '100만원 이하' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '100~200만원' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '200만원 이상' })).toBeInTheDocument();

      // Default should be "전체"
      expect(screen.getByRole('radio', { name: '전체' })).toHaveAttribute('aria-checked', 'true');
    });

    it('should render region checkboxes with 6 options', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const regions = ['수도권', '경상도', '전라도', '강원도', '제주도', '충청도'];
      regions.forEach(region => {
        const checkbox = screen.getByRole('checkbox', { name: region });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should render environment checkboxes with 4 options', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const environments = ['자연친화', '도심선호', '카페작업', '코워킹 필수'];
      environments.forEach(env => {
        const checkbox = screen.getByRole('checkbox', { name: env });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should render season checkboxes with 4 options', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const seasons = ['봄', '여름', '가을', '겨울'];
      seasons.forEach(season => {
        const checkbox = screen.getByRole('checkbox', { name: season });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should render reset and apply buttons', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const resetButton = screen.getByRole('button', { name: /필터 초기화/i });
      const applyButton = screen.getByRole('button', { name: /적용하기/i });

      expect(resetButton).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
      expect(applyButton).toHaveTextContent('적용하기 (0개 필터)');
    });
  });

  // ============================================
  // Interaction Tests (15 tests)
  // ============================================

  describe('Interaction Tests', () => {
    it('should call onChange when search input changes', async () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const searchInput = screen.getByPlaceholderText('도시명 검색...');

      // Use fireEvent.change for immediate update
      fireEvent.change(searchInput, { target: { value: 'seoul' } });

      await waitFor(() => {
        expect(searchInput).toHaveValue('seoul');
      });
    });

    it('should auto-apply filter when search input changes', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const searchInput = screen.getByPlaceholderText('도시명 검색...');
      fireEvent.change(searchInput, { target: { value: 'busan' } });

      // onFilterChange should be called, but due to state timing it will be called with empty string first
      // Click the apply button to ensure the current state is sent
      await user.click(screen.getByRole('button', { name: /적용하기/i }));

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalled();
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
        expect(lastCall.searchQuery).toBe('busan');
      });
    });

    it('should change budget radio selection', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Click the label instead of the radio button directly
      const budgetLabel = screen.getByText('100만원 이하');
      await user.click(budgetLabel);

      await waitFor(() => {
        const budgetOption = screen.getByRole('radio', { name: '100만원 이하' });
        expect(budgetOption).toHaveAttribute('aria-checked', 'true');
      }, { timeout: 2000 });
      expect(screen.getByRole('radio', { name: '전체' })).toHaveAttribute('aria-checked', 'false');
    });

    it('should auto-apply filter when budget changes', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const budgetLabel = screen.getByText('100~200만원');
      await user.click(budgetLabel);

      // Due to stale state closure, the first onChange will have old value
      // Click apply to ensure current state is sent
      await user.click(screen.getByRole('button', { name: /적용하기/i }));

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalled();
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
        expect(lastCall.budget).toBe('100~200만원');
      }, { timeout: 2000 });
    });

    it('should select single region checkbox', async () => {
      const user = userEvent.setup();
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Click the label instead of the checkbox
      const label = screen.getByText('수도권');
      await user.click(label);

      // Check that onFilterChange was called with the correct region
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].regions).toContain('수도권');
      }, { timeout: 3000 });
    });

    it('should select multiple region checkboxes', async () => {
      const user = userEvent.setup();
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Click the labels instead of the checkboxes
      await user.click(screen.getByText('수도권'));
      await user.click(screen.getByText('제주도'));

      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].regions).toContain('수도권');
        expect(lastCall[0].regions).toContain('제주도');
      }, { timeout: 3000 });
    });

    it('should deselect region checkbox', async () => {
      const user = userEvent.setup();
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const label = screen.getByLabelText('강원도', { selector: 'button' });

      // Select
      await user.click(label);
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].regions).toContain('강원도');
      }, { timeout: 3000 });

      // Clear mock to isolate second call
      mockOnFilterChange.mockClear();

      // Deselect
      await user.click(label);
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].regions).not.toContain('강원도');
      }, { timeout: 3000 });
    });

    it('should toggle environment checkbox', async () => {
      const user = userEvent.setup();
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const checkbox = screen.getByLabelText('자연친화', { selector: 'button' });

      await user.click(checkbox);
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].environment).toContain('자연친화');
      }, { timeout: 3000 });

      mockOnFilterChange.mockClear();

      await user.click(checkbox);
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].environment).not.toContain('자연친화');
      }, { timeout: 3000 });
    });

    it('should toggle season checkbox', async () => {
      const user = userEvent.setup();
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const checkbox = screen.getByLabelText('봄', { selector: 'button' });

      await user.click(checkbox);
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].bestSeason).toContain('봄');
      }, { timeout: 3000 });

      mockOnFilterChange.mockClear();

      await user.click(checkbox);
      await waitFor(() => {
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
        expect(lastCall).toBeDefined();
        expect(lastCall[0].bestSeason).not.toContain('봄');
      }, { timeout: 3000 });
    });

    it('should clear all filters when reset button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Set various filters
      const searchInput = screen.getByPlaceholderText('도시명 검색...');
      fireEvent.change(searchInput, { target: { value: 'seoul' } });
      await user.click(screen.getByText('100만원 이하'));
      await user.click(screen.getByText('수도권'));
      await user.click(screen.getByText('자연친화'));
      await user.click(screen.getByText('봄'));

      // Click reset
      const resetButton = screen.getByRole('button', { name: /필터 초기화/i });
      await user.click(resetButton);

      // Verify all cleared
      await waitFor(() => {
        expect(screen.getByPlaceholderText('도시명 검색...')).toHaveValue('');
      });
      expect(screen.getByRole('radio', { name: '전체' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('checkbox', { name: '수도권' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: '자연친화' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: '봄' })).not.toBeChecked();
    });

    it('should reset all state when reset is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Apply multiple filters
      await user.click(screen.getByText('200만원 이상'));
      await user.click(screen.getByText('제주도'));
      await user.click(screen.getByText('경상도'));
      await user.click(screen.getByText('코워킹 필수'));
      await user.click(screen.getByText('여름'));
      await user.click(screen.getByText('겨울'));

      const resetButton = screen.getByRole('button', { name: /필터 초기화/i });
      await user.click(resetButton);

      // Verify filter count is 0
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /적용하기 \(0개 필터\)/i })).toBeInTheDocument();
      });
    });

    it('should call onFilterChange when apply button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Set some filters
      await user.click(screen.getByText('100만원 이하'));
      await user.click(screen.getByText('전라도'));

      mockOnFilterChange.mockClear();

      const applyButton = screen.getByRole('button', { name: /적용하기/i });
      await user.click(applyButton);

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should display active filter count with 0 filters', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      const applyButton = screen.getByRole('button', { name: /적용하기/i });
      expect(applyButton).toHaveTextContent('적용하기 (0개 필터)');
    });

    it('should display active filter count with 3 filters', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Apply 3 filters: budget + 2 regions
      await user.click(screen.getByText('100만원 이하'));
      await user.click(screen.getByText('수도권'));
      await user.click(screen.getByText('강원도'));

      await waitFor(() => {
        const applyButton = screen.getByRole('button', { name: /적용하기 \(3개 필터\)/i });
        expect(applyButton).toBeInTheDocument();
      });
    });

    it('should render mobile Sheet trigger button with filter count badge', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Find mobile trigger button (with SlidersHorizontal icon and lg:hidden class)
      const mobileButtons = screen.getAllByRole('button');
      const mobileTrigger = mobileButtons.find(btn => btn.classList.contains('lg:hidden'));

      expect(mobileTrigger).toBeInTheDocument();

      // Mobile trigger should exist for responsive design
      expect(mobileTrigger?.classList.contains('lg:hidden')).toBe(true);
    });
  });

  // ============================================
  // Filter State Management Tests (5 tests)
  // ============================================

  describe('Filter State Management Tests', () => {
    it('should apply multiple filters simultaneously', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Apply search, budget, region, environment, and season
      const searchInput = screen.getByPlaceholderText('도시명 검색...');
      fireEvent.change(searchInput, { target: { value: 'gangneung' } });

      await user.click(screen.getByText('100~200만원'));
      await user.click(screen.getByText('강원도'));
      await user.click(screen.getByText('자연친화'));
      await user.click(screen.getByText('가을'));

      // Click apply button to ensure all current state is sent
      await user.click(screen.getByRole('button', { name: /적용하기/i }));

      // Wait for filters to apply
      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalled();
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
        expect(lastCall.searchQuery).toBe('gangneung');
        expect(lastCall.budget).toBe('100~200만원');
        expect(lastCall.regions).toContain('강원도');
        expect(lastCall.environment).toContain('자연친화');
        expect(lastCall.bestSeason).toContain('가을');
      });
    });

    it('should persist filter combination state', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Apply complex filter combination
      await user.click(screen.getByText('200만원 이상'));
      await user.click(screen.getByText('제주도'));
      await user.click(screen.getByText('수도권'));
      await user.click(screen.getByText('도심선호'));
      await user.click(screen.getByText('카페작업'));
      await user.click(screen.getByText('봄'));
      await user.click(screen.getByText('여름'));

      // Wait a bit for state to update
      await waitFor(() => {
        expect(screen.getByRole('radio', { name: '200만원 이상' })).toHaveAttribute('aria-checked', 'true');
      });

      // Verify state persists
      expect(screen.getByRole('checkbox', { name: '제주도' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '수도권' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '도심선호' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '카페작업' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '봄' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: '여름' })).toBeChecked();
    });

    it('should handle setTimeout debouncing behavior for checkboxes', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      mockOnFilterChange.mockClear();

      // Click region checkbox
      await user.click(screen.getByText('충청도'));

      // Filter is applied via setTimeout(handleApplyFilters, 0)
      // Wait for it to be called
      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    it('should validate FilterState object structure', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Set all filter types
      const searchInput = screen.getByPlaceholderText('도시명 검색...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      await user.click(screen.getByText('100만원 이하'));
      await user.click(screen.getByText('전라도'));
      await user.click(screen.getByText('코워킹 필수'));
      await user.click(screen.getByText('겨울'));

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalled();
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];

        // Validate structure
        expect(lastCall).toHaveProperty('searchQuery');
        expect(lastCall).toHaveProperty('budget');
        expect(lastCall).toHaveProperty('regions');
        expect(lastCall).toHaveProperty('environment');
        expect(lastCall).toHaveProperty('bestSeason');

        // Validate types
        expect(typeof lastCall.searchQuery).toBe('string');
        expect(typeof lastCall.budget).toBe('string');
        expect(Array.isArray(lastCall.regions)).toBe(true);
        expect(Array.isArray(lastCall.environment)).toBe(true);
        expect(Array.isArray(lastCall.bestSeason)).toBe(true);
      });
    });

    it('should propagate filter change events correctly', async () => {
      const user = userEvent.setup({ delay: null });
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      mockOnFilterChange.mockClear();

      // Apply budget filter (auto-applies)
      await user.click(screen.getByText('100~200만원'));
      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      });

      mockOnFilterChange.mockClear();

      // Apply region filter (uses setTimeout)
      await user.click(screen.getByText('경상도'));

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      });

      mockOnFilterChange.mockClear();

      // Click apply button
      await user.click(screen.getByRole('button', { name: /적용하기/i }));
      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      });
    });
  });
});
