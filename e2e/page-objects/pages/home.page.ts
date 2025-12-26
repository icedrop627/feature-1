import { Page, Locator } from '@playwright/test';
import { FilterSidebarComponent } from '../components/filter-sidebar.component';
import { CityGridComponent } from '../components/city-grid.component';
import { NavigationComponent } from '../components/navigation.component';

export class HomePage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly filterSidebar: FilterSidebarComponent;
  readonly cityGrid: CityGridComponent;
  readonly heroSection: Locator;
  readonly totalCitiesText: Locator;
  readonly totalReviewsText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.filterSidebar = new FilterSidebarComponent(page);
    this.cityGrid = new CityGridComponent(page);
    this.heroSection = page.locator('section').first();
    this.totalCitiesText = page.locator('text=/개의 도시/');
    this.totalReviewsText = page.locator('text=/개의 리뷰/');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalCityCount(): Promise<number> {
    const text = await this.totalCitiesText.textContent();
    return parseInt(text?.match(/(\d+)개의 도시/)?.[1] || '0');
  }

  async getTotalReviewCount(): Promise<number> {
    const text = await this.totalReviewsText.textContent();
    return parseInt(text?.match(/(\d+)개의 리뷰/)?.[1] || '0');
  }

  async isLoaded(): Promise<boolean> {
    return await this.cityGrid.isVisible();
  }
}
