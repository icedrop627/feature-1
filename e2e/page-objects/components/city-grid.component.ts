import { Page, Locator } from '@playwright/test';
import { CityCardComponent } from './city-card.component';

export class CityGridComponent {
  readonly page: Page;
  readonly gridContainer: Locator;
  readonly sortSelect: Locator;
  readonly cityCards: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gridContainer = page.locator('[class*="grid"]').first();
    this.sortSelect = page.locator('button[role="combobox"]');
    this.cityCards = page.locator('[data-testid^="city-card-"]');
    this.emptyMessage = page.locator('text=검색 결과가 없습니다');
  }

  async selectSort(option: '좋아요순' | '생활비 낮은순' | '생활비 높은순') {
    await this.sortSelect.click();
    await this.page.waitForTimeout(200);
    await this.page.locator(`text="${option}"`).click();
    await this.page.waitForTimeout(500);
  }

  async getCityCards(): Promise<CityCardComponent[]> {
    const count = await this.cityCards.count();
    const cards: CityCardComponent[] = [];

    for (let i = 0; i < count; i++) {
      const cardElement = this.cityCards.nth(i);
      cards.push(new CityCardComponent(this.page, cardElement));
    }

    return cards;
  }

  async getCityCount(): Promise<number> {
    return await this.cityCards.count();
  }

  async waitForUpdate() {
    await this.page.waitForTimeout(500);
  }

  async isVisible(): Promise<boolean> {
    return await this.gridContainer.isVisible();
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyMessage.isVisible();
  }

  async getCityCardByName(name: string): Promise<CityCardComponent | null> {
    const card = this.page.locator(`[data-testid^="city-card-"]:has-text("${name}")`).first();
    if (await card.isVisible()) {
      return new CityCardComponent(this.page, card);
    }
    return null;
  }
}
