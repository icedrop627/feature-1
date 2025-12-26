import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CityCard } from '../city-card';
import { mockCity, mockCityWithMinimalData } from './mock-data';
import { createMockSupabaseClient, MockSupabaseClient } from './mock-supabase';

// Mock the Supabase client
let mockSupabaseClient: MockSupabaseClient;

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient,
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('CityCard Component', () => {
  beforeEach(() => {
    mockSupabaseClient = createMockSupabaseClient();
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ============================================
  // RENDERING TESTS (10 tests)
  // ============================================

  describe('Rendering Tests', () => {
    test('should render city Korean name', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('서울')).toBeInTheDocument();
    });

    test('should render city description', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('대한민국의 수도이자 최대 도시')).toBeInTheDocument();
    });

    test('should render city image with correct alt text', () => {
      render(<CityCard city={mockCity} />);
      const image = screen.getByAltText('서울');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockCity.cover_image);
    });

    test('should display like and dislike counts', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    test('should display budget information', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('예산:')).toBeInTheDocument();
      expect(screen.getByText('100~200만원')).toBeInTheDocument();
    });

    test('should display region information', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('지역:')).toBeInTheDocument();
      expect(screen.getByText('수도권')).toBeInTheDocument();
    });

    test('should render environment tags', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('환경:')).toBeInTheDocument();
      expect(screen.getByText('도시, 현대적')).toBeInTheDocument();
    });

    test('should render season tags', () => {
      render(<CityCard city={mockCity} />);
      expect(screen.getByText('최고 계절:')).toBeInTheDocument();
      expect(screen.getByText('봄, 가을')).toBeInTheDocument();
    });

    test('should render default image when cover_image is null', () => {
      render(<CityCard city={mockCityWithMinimalData} />);
      const image = screen.getByAltText('부산');
      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1517154421773-0529f29ea451'
      );
    });

    test('should display dash for null environment and season', () => {
      render(<CityCard city={mockCityWithMinimalData} />);
      const dashElements = screen.getAllByText('-');
      expect(dashElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ============================================
  // INTERACTION TESTS (12 tests)
  // ============================================

  describe('Interaction Tests', () => {
    test('should increment like count when like button is clicked', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const likeButton = screen.getAllByRole('button')[0];
      await user.click(likeButton);

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });
    });

    test('should increment dislike count when dislike button is clicked', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const dislikeButton = screen.getAllByRole('button')[1];
      await user.click(dislikeButton);

      await waitFor(() => {
        expect(screen.getByText('9')).toBeInTheDocument();
      });
    });

    test('should remove dislike when like is clicked', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const buttons = screen.getAllByRole('button');
      const likeButton = buttons[0];
      const dislikeButton = buttons[1];

      // First dislike
      await user.click(dislikeButton);
      await waitFor(() => {
        expect(screen.getByText('9')).toBeInTheDocument();
      });

      // Then like
      await user.click(likeButton);
      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
      });
    });

    test('should remove like when dislike is clicked', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const buttons = screen.getAllByRole('button');
      const likeButton = buttons[0];
      const dislikeButton = buttons[1];

      // First like
      await user.click(likeButton);
      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });

      // Then dislike
      await user.click(dislikeButton);
      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('9')).toBeInTheDocument();
      });
    });

    test('should toggle off when like button is clicked twice', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const likeButton = screen.getAllByRole('button')[0];

      // First click - like
      await user.click(likeButton);
      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });

      // Second click - unlike
      await user.click(likeButton);
      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    test('should disable buttons during loading state', async () => {
      const user = userEvent.setup();

      // Delay the API response
      mockSupabaseClient.__setUpdateResponse(
        new Promise((resolve) => setTimeout(() => resolve({ data: null, error: null }), 100))
      );

      render(<CityCard city={mockCity} />);
      const buttons = screen.getAllByRole('button');

      await user.click(buttons[0]);

      // Check if both buttons are disabled during loading
      expect(buttons[0]).toBeDisabled();
      expect(buttons[1]).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(buttons[0]).not.toBeDisabled();
        expect(buttons[1]).not.toBeDisabled();
      });
    });

    test('should re-enable buttons after loading completes', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const likeButton = screen.getAllByRole('button')[0];
      await user.click(likeButton);

      await waitFor(() => {
        expect(likeButton).not.toBeDisabled();
      });
    });

    test('should call Supabase API on like button click', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const likeButton = screen.getAllByRole('button')[0];
      await user.click(likeButton);

      await waitFor(() => {
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('cities');
      });
    });

    test('should update count on successful API call', async () => {
      const user = userEvent.setup();
      mockSupabaseClient.__setUpdateResponse({ data: {}, error: null });

      render(<CityCard city={mockCity} />);
      const likeButton = screen.getAllByRole('button')[0];

      await user.click(likeButton);

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });
    });

    test('should rollback state on API error', async () => {
      const user = userEvent.setup();
      mockSupabaseClient.__setUpdateResponse({
        data: null,
        error: { message: 'Database error' }
      });

      render(<CityCard city={mockCity} />);
      const likeButton = screen.getAllByRole('button')[0];

      await user.click(likeButton);

      // Should rollback to original count
      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    test('should log error on API failure', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockSupabaseClient.__setUpdateResponse({
        data: null,
        error: { message: 'Database error' }
      });

      render(<CityCard city={mockCity} />);
      const likeButton = screen.getAllByRole('button')[0];

      await user.click(likeButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    test('should support keyboard interaction with Enter key', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const likeButton = screen.getAllByRole('button')[0];
      likeButton.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // REALTIME FEATURE TESTS (6 tests)
  // ============================================

  describe('Realtime Feature Tests', () => {
    test('should subscribe to realtime channel on mount', () => {
      render(<CityCard city={mockCity} />);

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith(`city-${mockCity.id}`);
    });

    test('should update like count in real-time', async () => {
      render(<CityCard city={mockCity} />);

      const channel = mockSupabaseClient.__getChannel(`city-${mockCity.id}`);

      // Simulate realtime update
      channel?.triggerUpdate({
        new: {
          id: mockCity.id,
          likes: 100,
          dislikes: 8,
        },
      });

      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument();
      });
    });

    test('should update dislike count in real-time', async () => {
      render(<CityCard city={mockCity} />);

      const channel = mockSupabaseClient.__getChannel(`city-${mockCity.id}`);

      // Simulate realtime update
      channel?.triggerUpdate({
        new: {
          id: mockCity.id,
          likes: 42,
          dislikes: 20,
        },
      });

      await waitFor(() => {
        expect(screen.getByText('20')).toBeInTheDocument();
      });
    });

    test('should unsubscribe from channel on unmount', () => {
      const { unmount } = render(<CityCard city={mockCity} />);
      const channel = mockSupabaseClient.__getChannel(`city-${mockCity.id}`);

      unmount();

      expect(mockSupabaseClient.removeChannel).toHaveBeenCalledWith(channel);
    });

    test('should ignore updates for other cities', async () => {
      render(<CityCard city={mockCity} />);

      const channel = mockSupabaseClient.__getChannel(`city-${mockCity.id}`);

      // This shouldn't update our city
      channel?.triggerUpdate({
        new: {
          id: 'different-city-id',
          likes: 999,
          dislikes: 999,
        },
      });

      // Original counts should remain
      await waitFor(() => {
        expect(screen.queryByText('999')).not.toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    test('should handle realtime updates during user interaction', async () => {
      const user = userEvent.setup();
      render(<CityCard city={mockCity} />);

      const likeButton = screen.getAllByRole('button')[0];

      // User clicks like
      await user.click(likeButton);

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });

      // Realtime update arrives
      const channel = mockSupabaseClient.__getChannel(`city-${mockCity.id}`);
      channel?.triggerUpdate({
        new: {
          id: mockCity.id,
          likes: 50,
          dislikes: 10,
        },
      });

      // Should show realtime data
      await waitFor(() => {
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });
  });
});
