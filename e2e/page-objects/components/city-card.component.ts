import { Page, Locator } from '@playwright/test';

export class CityCardComponent {
  readonly page: Page;
  readonly card: Locator;
  readonly cityName: Locator;
  readonly cityNameEn: Locator;
  readonly description: Locator;
  readonly likeButton: Locator;
  readonly dislikeButton: Locator;
  readonly likeCount: Locator;
  readonly dislikeCount: Locator;
  readonly budget: Locator;
  readonly region: Locator;

  constructor(page: Page, cardLocator: Locator) {
    this.page = page;
    this.card = cardLocator;
    this.cityName = cardLocator.locator('h3').first();
    this.cityNameEn = cardLocator.locator('p').first();
    this.description = cardLocator.locator('p').nth(1);
    this.likeButton = cardLocator.locator('button:has-text("좋아요")').or(
      cardLocator.locator('button:has(svg[class*="thumbs-up"])')
    );
    this.dislikeButton = cardLocator.locator('button:has-text("싫어요")').or(
      cardLocator.locator('button:has(svg[class*="thumbs-down"])')
    );
    this.likeCount = cardLocator.locator('text=/좋아요 \\d+/');
    this.dislikeCount = cardLocator.locator('text=/싫어요 \\d+/');
    this.budget = cardLocator.locator('text=/원/');
    this.region = cardLocator.locator('[class*="badge"]').first();
  }

  async clickLike() {
    await this.likeButton.click();
    await this.page.waitForTimeout(300); // Wait for animation/API
  }

  async clickDislike() {
    await this.dislikeButton.click();
    await this.page.waitForTimeout(300); // Wait for animation/API
  }

  async getLikeCount(): Promise<number> {
    const text = await this.likeCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getDislikeCount(): Promise<number> {
    const text = await this.dislikeCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getCityName(): Promise<string> {
    return (await this.cityName.textContent()) || '';
  }

  async isLiked(): Promise<boolean> {
    const buttonClass = await this.likeButton.getAttribute('class');
    return buttonClass?.includes('bg-red') || false;
  }

  async isDisliked(): Promise<boolean> {
    const buttonClass = await this.dislikeButton.getAttribute('class');
    return buttonClass?.includes('bg-blue') || false;
  }
}
