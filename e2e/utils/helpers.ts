import { Page, Locator } from '@playwright/test';

/**
 * Common helper functions for E2E tests
 */

/**
 * Wait for element to be visible and stable
 */
export async function waitForStableElement(locator: Locator, timeout = 5000) {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.waitFor({ state: 'attached', timeout });
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Get text content safely
 */
export async function getTextContent(locator: Locator): Promise<string> {
  const text = await locator.textContent();
  return text?.trim() || '';
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `e2e/screenshots/actual/${name}-${timestamp}.png` });
}

/**
 * Wait for toast/notification message
 */
export async function waitForToast(page: Page, message?: string) {
  const toastLocator = message
    ? page.locator(`text=${message}`)
    : page.locator('[role="alert"], [role="status"]').first();

  await toastLocator.waitFor({ state: 'visible', timeout: 5000 });
  return toastLocator;
}
