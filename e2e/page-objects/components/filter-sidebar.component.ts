import { Page, Locator } from '@playwright/test';

export class FilterSidebarComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly resetButton: Locator;
  readonly applyButton: Locator;
  readonly mobileFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.resetButton = page.locator('button:has-text("필터 초기화")');
    this.applyButton = page.locator('button:has-text("적용하기")');
    this.mobileFilterButton = page.locator('button:has(svg[class*="sliders"])');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
  }

  async selectBudget(budget: string) {
    const budgetRadio = this.page.locator(`input[value="${budget}"]`).or(
      this.page.locator(`label:has-text("${budget}")`)
    );
    await budgetRadio.click();
    await this.page.waitForTimeout(100);
  }

  async selectRegion(region: string) {
    const regionCheckbox = this.page.locator(`input[id*="region-${region}"]`).or(
      this.page.locator(`label:has-text("${region}")`).first()
    );
    await regionCheckbox.click();
    await this.page.waitForTimeout(100);
  }

  async selectEnvironment(environment: string) {
    const envCheckbox = this.page.locator(`input[id*="env-${environment}"]`).or(
      this.page.locator(`label:has-text("${environment}")`).first()
    );
    await envCheckbox.click();
    await this.page.waitForTimeout(100);
  }

  async selectSeason(season: string) {
    const seasonCheckbox = this.page.locator(`input[id*="season-${season}"]`).or(
      this.page.locator(`label:has-text("${season}")`).first()
    );
    await seasonCheckbox.click();
    await this.page.waitForTimeout(100);
  }

  async clickReset() {
    await this.resetButton.click();
    await this.page.waitForTimeout(300);
  }

  async clickApply() {
    await this.applyButton.click();
    await this.page.waitForTimeout(300);
  }

  async getActiveFilterCount(): Promise<number> {
    const filterCountText = await this.applyButton.textContent();
    const match = filterCountText?.match(/\((\d+)개 필터\)/);
    return match ? parseInt(match[1]) : 0;
  }

  async openMobileFilter() {
    if (await this.mobileFilterButton.isVisible()) {
      await this.mobileFilterButton.click();
      await this.page.waitForTimeout(300);
    }
  }
}
