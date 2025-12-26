import { Page, Locator } from '@playwright/test';

/**
 * Custom wait utilities for E2E tests
 */

/**
 * Wait for loading spinner to disappear
 */
export async function waitForLoadingComplete(page: Page) {
  const spinner = page.locator('[role="status"], [aria-label*="loading"], .loading');
  if (await spinner.isVisible().catch(() => false)) {
    await spinner.waitFor({ state: 'hidden', timeout: 10000 });
  }
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(page: Page, durationMs = 300) {
  await page.waitForTimeout(durationMs);
}

/**
 * Wait for element to stop moving (useful for animations)
 */
export async function waitForStablePosition(locator: Locator) {
  let previousBox = await locator.boundingBox();

  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const currentBox = await locator.boundingBox();

    if (
      previousBox &&
      currentBox &&
      previousBox.x === currentBox.x &&
      previousBox.y === currentBox.y
    ) {
      return;
    }

    previousBox = currentBox;
  }
}

/**
 * Wait for real-time update (Supabase)
 */
export async function waitForRealtimeUpdate(page: Page, timeout = 5000) {
  // Wait a bit for Supabase realtime to propagate
  await page.waitForTimeout(Math.min(timeout, 1000));
}

/**
 * Wait for debounced input
 */
export async function waitForDebounce(durationMs = 500) {
  await new Promise(resolve => setTimeout(resolve, durationMs));
}
