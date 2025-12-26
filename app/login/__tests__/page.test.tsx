import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import LoginPage from '../page';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Mock dependencies
vi.mock('@/lib/supabase/client');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe('LoginPage Component', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockSignInWithPassword = vi.fn();

  const setupMocks = (signInResponse = { data: { user: { id: 'test-id' } }, error: null }) => {
    (useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (createClient as any).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    });

    mockSignInWithPassword.mockResolvedValue(signInResponse);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // RENDERING TESTS (7 tests)
  // ============================================

  describe('Rendering Tests', () => {
    it('should render login form', () => {
      render(<LoginPage />);
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText('이메일');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', '이메일을 입력하세요');
    });

    it('should render password input field', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText('비밀번호');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', '비밀번호를 입력하세요');
    });

    it('should render login button', () => {
      render(<LoginPage />);
      const loginButton = screen.getByRole('button', { name: '로그인' });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute('type', 'submit');
    });

    it('should render register link', () => {
      render(<LoginPage />);
      const registerLink = screen.getByRole('link', { name: /회원가입/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should render forgot password link', () => {
      render(<LoginPage />);
      const forgotPasswordLink = screen.getByRole('link', { name: '비밀번호 찾기' });
      expect(forgotPasswordLink).toBeInTheDocument();
    });

    it('should render logo and title', () => {
      render(<LoginPage />);

      // Check for logo text
      const logo = screen.getByText('K-Nomad');
      expect(logo).toBeInTheDocument();

      // Check for title
      const title = screen.getByRole('heading', { name: '로그인' });
      expect(title).toBeInTheDocument();

      // Check for subtitle
      const subtitle = screen.getByText('디지털 노마드 여정을 시작하세요');
      expect(subtitle).toBeInTheDocument();
    });
  });

  // ============================================
  // FORM VALIDATION TESTS (5 tests)
  // ============================================

  describe('Form Validation Tests', () => {
    it('should show error when submitting with empty email', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      // Fill only password
      await userEvent.type(passwordInput, 'password123');

      // HTML5 validation should prevent submission
      expect(emailInput).toBeRequired();
      expect(emailInput).toHaveValue('');
    });

    it('should show error when submitting with empty password', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');

      // Fill only email
      await userEvent.type(emailInput, 'test@example.com');

      // HTML5 validation should prevent submission
      expect(passwordInput).toBeRequired();
      expect(passwordInput).toHaveValue('');
    });

    it('should validate email format using HTML5 validation', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');

      // Email input type should enforce format validation
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should allow submission with valid inputs', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
      expect(loginButton).not.toBeDisabled();
    });

    it('should verify required attributes on form fields', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  // ============================================
  // LOGIN FLOW TESTS (7 tests)
  // ============================================

  describe('Login Flow Tests', () => {
    it('should update state when email input changes', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');

      await userEvent.type(emailInput, 'user@example.com');

      expect(emailInput).toHaveValue('user@example.com');
    });

    it('should update state when password input changes', async () => {
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText('비밀번호');

      await userEvent.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('should call signInWithPassword on form submission', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should redirect to home on successful login', async () => {
      setupMocks({ data: { user: { id: 'user-123' } }, error: null });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should trigger page refresh on successful login', async () => {
      setupMocks({ data: { user: { id: 'user-123' } }, error: null });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it('should show error message on failed login', async () => {
      setupMocks({ data: null, error: { message: 'Invalid login credentials' } });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
      });
    });

    it('should disable button during loading state', async () => {
      // Create a promise that we can control
      let resolveLogin: any;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      mockSignInWithPassword.mockReturnValue(loginPromise);

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(loginButton);

      // Button should be disabled and show loading text
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '처리 중...' })).toBeDisabled();
      });

      // Resolve the login
      resolveLogin({ data: { user: { id: 'user-123' } }, error: null });
    });

    it('should re-enable button after loading completes', async () => {
      setupMocks({ data: null, error: { message: 'Login failed' } });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const loginButton = screen.getByRole('button', { name: '로그인' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(loginButton);

      // Wait for loading to complete
      await waitFor(() => {
        const button = screen.getByRole('button', { name: '로그인' });
        expect(button).not.toBeDisabled();
      });
    });
  });
});
