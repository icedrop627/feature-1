import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { getCitiesServer } from '@/lib/api/cities';
import { HeroSection } from '@/components/home/hero-section';
import { CityGridWrapper } from '@/components/home/city-grid-wrapper';

// Mock the API function
vi.mock('@/lib/api/cities', () => ({
  getCitiesServer: vi.fn(),
}));

// Mock the child components
vi.mock('@/components/home/hero-section', () => ({
  HeroSection: vi.fn(() => <div data-testid="hero-section">Hero Section</div>),
}));

vi.mock('@/components/home/city-grid-wrapper', () => ({
  CityGridWrapper: vi.fn(() => <div data-testid="city-grid-wrapper">City Grid</div>),
}));

describe('Home Page (Server Component)', () => {
  const mockCities = [
    {
      id: '1',
      name_ko: 'Seoul',
      name_en: 'Seoul',
      description: 'Capital of Korea',
      likes: 100,
      dislikes: 10,
      monthly_cost: 1500,
      region: 'Seoul',
      budget: 'Mid',
      environment: ['Urban'],
      best_season: ['Spring'],
      image_url: '/seoul.jpg',
      created_at: '2024-01-01',
    },
    {
      id: '2',
      name_ko: 'Busan',
      name_en: 'Busan',
      description: 'Coastal city',
      likes: 80,
      dislikes: 5,
      monthly_cost: 1200,
      region: 'Busan',
      budget: 'Mid',
      environment: ['Coastal'],
      best_season: ['Summer'],
      image_url: '/busan.jpg',
      created_at: '2024-01-02',
    },
    {
      id: '3',
      name_ko: 'Jeju',
      name_en: 'Jeju',
      description: 'Island paradise',
      likes: 120,
      dislikes: 8,
      monthly_cost: 1800,
      region: 'Jeju',
      budget: 'High',
      environment: ['Island'],
      best_season: ['Fall'],
      image_url: '/jeju.jpg',
      created_at: '2024-01-03',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render the server component successfully', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: mockCities,
      error: null,
    });

    const component = await Home();
    render(component);

    expect(screen.getByTestId('hero-section')).toBeDefined();
    expect(screen.getByTestId('city-grid-wrapper')).toBeDefined();
  });

  it('should call getCitiesServer', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: mockCities,
      error: null,
    });

    await Home();

    expect(getCitiesServer).toHaveBeenCalledTimes(1);
  });

  it('should render HeroSection with correct props', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: mockCities,
      error: null,
    });

    const component = await Home();
    render(component);

    const callArgs = (HeroSection as any).mock.calls[0][0];
    expect(callArgs).toEqual({
      totalCities: 3,
      totalReviews: 323, // 100+10+80+5+120+8 = 323
    });
  });

  it('should render CityGridWrapper with correct props', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: mockCities,
      error: null,
    });

    const component = await Home();
    render(component);

    const callArgs = (CityGridWrapper as any).mock.calls[0][0];
    expect(callArgs).toEqual({
      initialCities: mockCities,
    });
  });

  it('should handle empty cities array when data is null', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: null,
      error: null,
    });

    const component = await Home();
    render(component);

    const cityGridArgs = (CityGridWrapper as any).mock.calls[0][0];
    expect(cityGridArgs).toEqual({
      initialCities: [],
    });

    const heroArgs = (HeroSection as any).mock.calls[0][0];
    expect(heroArgs).toEqual({
      totalCities: 0,
      totalReviews: 0,
    });
  });

  it('should log error to console when API returns error', async () => {
    const mockError = { message: 'Database connection failed' };
    (getCitiesServer as any).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await Home();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch cities:',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('should still render page after error', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: null,
      error: { message: 'Network error' },
    });

    const component = await Home();
    render(component);

    // Page should still render with empty data
    expect(screen.getByTestId('hero-section')).toBeDefined();
    expect(screen.getByTestId('city-grid-wrapper')).toBeDefined();
  });

  it('should calculate statistics correctly (totalLikes and totalDislikes)', async () => {
    (getCitiesServer as any).mockResolvedValue({
      data: mockCities,
      error: null,
    });

    const component = await Home();
    render(component);

    // totalLikes: 100 + 80 + 120 = 300
    // totalDislikes: 10 + 5 + 8 = 23
    // totalReviews: 300 + 23 = 323

    const callArgs = (HeroSection as any).mock.calls[0][0];
    expect(callArgs.totalReviews).toBe(323);
  });
});
