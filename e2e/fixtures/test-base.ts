import { test as base } from '@playwright/test';

/**
 * Custom test fixture extending Playwright's base test
 * Add custom fixtures here as needed
 */
export const test = base.extend({
  // Example: Add custom fixtures here
  // authenticatedPage: async ({ page }, use) => {
  //   // Login logic
  //   await use(page);
  // },
});

export { expect } from '@playwright/test';
