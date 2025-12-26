import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import RegisterPage from '../page';
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

describe('RegisterPage Component', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockSignUp = vi.fn();

  const setupMocks = (signUpResponse = { data: { user: { id: 'test-id' } }, error: null }) => {
    (useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (createClient as any).mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    });

    mockSignUp.mockResolvedValue(signUpResponse);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // RENDERING TESTS (8 tests)
  // ============================================

  describe('Rendering Tests', () => {
    it('should render register form', () => {
      render(<RegisterPage />);
      // Find form by querying for the form element
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render name input field', () => {
      render(<RegisterPage />);
      const nameInput = screen.getByLabelText('이름');
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('placeholder', '이름을 입력하세요');
    });

    it('should render email input field', () => {
      render(<RegisterPage />);
      const emailInput = screen.getByLabelText('이메일');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', '이메일을 입력하세요');
    });

    it('should render password input field', () => {
      render(<RegisterPage />);
      const passwordInput = screen.getByLabelText('비밀번호');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', '비밀번호를 입력하세요');
    });

    it('should render password confirmation input field', () => {
      render(<RegisterPage />);
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('placeholder', '비밀번호를 다시 입력하세요');
    });

    it('should render terms checkbox', () => {
      render(<RegisterPage />);
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      expect(termsCheckbox).toBeInTheDocument();
    });

    it('should render register button', () => {
      render(<RegisterPage />);
      const registerButton = screen.getByRole('button', { name: '회원가입' });
      expect(registerButton).toBeInTheDocument();
      expect(registerButton).toHaveAttribute('type', 'submit');
    });

    it('should render login link', () => {
      render(<RegisterPage />);
      const loginLink = screen.getByRole('link', { name: /로그인/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  // ============================================
  // FORM VALIDATION TESTS (10 tests)
  // ============================================

  describe('Form Validation Tests', () => {
    it('should show error when passwords do not match', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'differentpassword');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
      });
    });

    it('should show error when password is less than 8 characters', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'short1!');
      await userEvent.type(confirmPasswordInput, 'short1!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument();
      });
    });

    it('should prevent submission when terms are not agreed', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');

      // Terms checkbox should be required
      expect(termsCheckbox).toBeRequired();
      expect(termsCheckbox).not.toBeChecked();
    });

    it('should show error when name field is empty', () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');

      // HTML5 validation should prevent submission
      expect(nameInput).toBeRequired();
      expect(nameInput).toHaveValue('');
    });

    it('should show error when email field is empty', () => {
      render(<RegisterPage />);

      const emailInput = screen.getByLabelText('이메일');

      // HTML5 validation should prevent submission
      expect(emailInput).toBeRequired();
      expect(emailInput).toHaveValue('');
    });

    it('should validate email format using HTML5 validation', () => {
      render(<RegisterPage />);

      const emailInput = screen.getByLabelText('이메일');

      // Email input type should enforce format validation
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should display password hint', () => {
      render(<RegisterPage />);

      const passwordHint = screen.getByText('8자 이상, 영문, 숫자, 특수문자 포함');
      expect(passwordHint).toBeInTheDocument();
    });

    it('should allow valid input validation to pass', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);

      expect(nameInput).toHaveValue('Test User');
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123!');
      expect(confirmPasswordInput).toHaveValue('password123!');
      expect(termsCheckbox).toBeChecked();
    });

    it('should update formData state when inputs change', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(passwordInput, 'mypassword123');
      await userEvent.type(confirmPasswordInput, 'mypassword123');

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(passwordInput).toHaveValue('mypassword123');
      expect(confirmPasswordInput).toHaveValue('mypassword123');
    });

    it('should toggle checkbox state correctly', async () => {
      render(<RegisterPage />);

      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });

      expect(termsCheckbox).not.toBeChecked();

      await userEvent.click(termsCheckbox);
      expect(termsCheckbox).toBeChecked();

      await userEvent.click(termsCheckbox);
      expect(termsCheckbox).not.toBeChecked();
    });
  });

  // ============================================
  // REGISTRATION FLOW TESTS (7 tests)
  // ============================================

  describe('Registration Flow Tests', () => {
    it('should call signUp with correct data on form submission', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123!',
          options: {
            data: {
              name: 'Test User',
            },
          },
        });
      });
    });

    it('should redirect to home on successful registration', async () => {
      setupMocks({ data: { user: { id: 'user-123' } }, error: null });

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should trigger page refresh on successful registration', async () => {
      setupMocks({ data: { user: { id: 'user-123' } }, error: null });

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it('should show error message on failed registration', async () => {
      setupMocks({ data: null, error: { message: 'User already registered' } });

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'existing@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('User already registered')).toBeInTheDocument();
      });
    });

    it('should include user metadata with name field', async () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          expect.objectContaining({
            options: {
              data: {
                name: 'John Doe',
              },
            },
          })
        );
      });
    });

    it('should disable button during loading state', async () => {
      // Create a promise that we can control
      let resolveSignUp: any;
      const signUpPromise = new Promise((resolve) => {
        resolveSignUp = resolve;
      });

      mockSignUp.mockReturnValue(signUpPromise);

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      // Button should be disabled and show loading text
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '처리 중...' })).toBeDisabled();
      });

      // Resolve the sign up
      resolveSignUp({ data: { user: { id: 'user-123' } }, error: null });
    });

    it('should clear loading state on error', async () => {
      setupMocks({ data: null, error: { message: 'Registration failed' } });

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText('이름');
      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
      const termsCheckbox = screen.getByRole('checkbox', { name: /이용약관/i });
      const registerButton = screen.getByRole('button', { name: '회원가입' });

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123!');
      await userEvent.type(confirmPasswordInput, 'password123!');
      await userEvent.click(termsCheckbox);
      await userEvent.click(registerButton);

      // Wait for loading to complete and button to be re-enabled
      await waitFor(() => {
        const button = screen.getByRole('button', { name: '회원가입' });
        expect(button).not.toBeDisabled();
      });
    });
  });
});
