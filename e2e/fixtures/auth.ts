import { Page } from '@playwright/test';

/**
 * Authentication fixture helpers
 */

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

/**
 * Login as a test user
 */
export async function loginAsUser(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

/**
 * Register a new test user
 */
export async function registerNewUser(page: Page, user: TestUser & { name: string }) {
  await page.goto('/register');
  await page.fill('input[name="name"]', user.name);
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);
  await page.check('input[type="checkbox"]'); // Terms checkbox
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

/**
 * Logout current user
 */
export async function logout(page: Page) {
  await page.click('button:has-text("로그아웃")');
  await page.waitForURL('/');
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  return page.locator('button:has-text("로그아웃")').isVisible();
}
