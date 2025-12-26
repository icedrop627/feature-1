import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CityGridWrapper } from '../city-grid-wrapper';
import { mockCities } from './mock-data';

// Mock the child components
jest.mock('../filter-sidebar', () => ({
  FilterSidebar: ({ onFilterChange }: any) => (
    <div data-testid="filter-sidebar">
      <button
        data-testid="change-filter-button"
        onClick={() =>
          onFilterChange({
            searchQuery: 'test',
            budget: '100만원 이하',
            regions: ['수도권'],
            environment: ['도시'],
            bestSeason: ['봄'],
          })
        }
      >
        Change Filter
      </button>
    </div>
  ),
}));

jest.mock('../city-grid', () => ({
  CityGrid: ({ cities, filters }: any) => (
    <div data-testid="city-grid">
      <div data-testid="cities-prop">{JSON.stringify(cities.length)}</div>
      <div data-testid="filters-prop">{JSON.stringify(filters)}</div>
    </div>
  ),
}));

describe('CityGridWrapper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // CITY GRID WRAPPER TESTS (6 tests)
  // ============================================

  test('should render FilterSidebar component', () => {
    render(<CityGridWrapper initialCities={mockCities} />);
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
  });

  test('should render CityGrid component', () => {
    render(<CityGridWrapper initialCities={mockCities} />);
    expect(screen.getByTestId('city-grid')).toBeInTheDocument();
  });

  test('should initialize with empty filter state', () => {
    render(<CityGridWrapper initialCities={mockCities} />);
    const filtersProp = screen.getByTestId('filters-prop');

    const expectedFilters = {
      searchQuery: '',
      budget: '전체',
      regions: [],
      environment: [],
      bestSeason: [],
    };

    expect(filtersProp.textContent).toBe(JSON.stringify(expectedFilters));
  });

  test('should update filters when handleFilterChange is called', async () => {
    const user = userEvent.setup();
    render(<CityGridWrapper initialCities={mockCities} />);

    const changeFilterButton = screen.getByTestId('change-filter-button');
    await user.click(changeFilterButton);

    const filtersProp = screen.getByTestId('filters-prop');
    const expectedFilters = {
      searchQuery: 'test',
      budget: '100만원 이하',
      regions: ['수도권'],
      environment: ['도시'],
      bestSeason: ['봄'],
    };

    expect(filtersProp.textContent).toBe(JSON.stringify(expectedFilters));
  });

  test('should pass initialCities prop to CityGrid', () => {
    render(<CityGridWrapper initialCities={mockCities} />);
    const citiesProp = screen.getByTestId('cities-prop');

    expect(citiesProp.textContent).toBe(JSON.stringify(mockCities.length));
  });

  test('should render flex layout structure', () => {
    const { container } = render(<CityGridWrapper initialCities={mockCities} />);
    const wrapperDiv = container.firstChild as HTMLElement;

    expect(wrapperDiv).toHaveClass('flex');
  });
});
