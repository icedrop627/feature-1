import { expect, Page, Locator } from '@playwright/test';

/**
 * Custom assertions for E2E tests
 */

/**
 * Assert element is visible and has text
 */
export async function expectTextVisible(locator: Locator, text: string) {
  await expect(locator).toBeVisible();
  await expect(locator).toContainText(text);
}

/**
 * Assert page has correct title
 */
export async function expectPageTitle(page: Page, title: string) {
  await expect(page).toHaveTitle(title);
}

/**
 * Assert URL matches pattern
 */
export async function expectURL(page: Page, urlPattern: string | RegExp) {
  await expect(page).toHaveURL(urlPattern);
}

/**
 * Assert element count
 */
export async function expectCount(locator: Locator, count: number) {
  await expect(locator).toHaveCount(count);
}

/**
 * Assert element is enabled/disabled
 */
export async function expectEnabled(locator: Locator, enabled = true) {
  if (enabled) {
    await expect(locator).toBeEnabled();
  } else {
    await expect(locator).toBeDisabled();
  }
}

/**
 * Assert element has attribute value
 */
export async function expectAttribute(locator: Locator, attribute: string, value: string | RegExp) {
  await expect(locator).toHaveAttribute(attribute, value);
}
