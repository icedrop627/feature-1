/**
 * Test data generation utilities
 */

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Generate random username
 */
export function generateRandomUsername(): string {
  const random = Math.random().toString(36).substring(7);
  return `testuser_${random}`;
}

/**
 * Generate random password
 */
export function generateRandomPassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Generate test user data
 */
export function generateTestUser() {
  return {
    name: generateRandomUsername(),
    email: generateRandomEmail(),
    password: generateRandomPassword(),
  };
}
