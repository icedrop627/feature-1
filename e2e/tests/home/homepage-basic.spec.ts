import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home.page';

test.describe('홈페이지 기본 기능', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('홈페이지로 이동하면 로고가 표시되어야 함', async ({ page }) => {
    // Given: 사용자가 홈페이지에 접속
    await homePage.goto();

    // When: 페이지가 로드됨
    await page.waitForLoadState('networkidle');

    // Then: 로고가 표시되어야 함
    await expect(homePage.navigation.logo).toBeVisible();
  });

  test('홈페이지로 이동하면 도시 카드들이 표시되어야 함', async ({ page }) => {
    // Given: 사용자가 홈페이지에 접속
    await homePage.goto();

    // When: 페이지가 로드됨
    await page.waitForLoadState('networkidle');

    // Then: 도시 카드들이 표시되어야 함
    const cityCount = await homePage.cityGrid.getCityCount();
    expect(cityCount).toBeGreaterThan(0);
  });

  test('홈페이지에 처음 접속하면 필터가 적용되지 않아야 함', async ({ page }) => {
    // Given: 사용자가 홈페이지에 처음 접속
    await homePage.goto();

    // When: 페이지가 로드됨
    await page.waitForLoadState('networkidle');

    // Then: 필터가 적용되지 않은 상태여야 함
    // 필터 초기화 버튼이 비활성화되어 있거나 필터 카운트가 0이어야 함
    const filterCount = await homePage.filterSidebar.getActiveFilterCount();
    expect(filterCount).toBe(0);
  });

  test('필터가 적용되지 않으면 데이터베이스의 모든 도시가 표시되어야 함', async ({ page }) => {
    // Given: 사용자가 홈페이지에 접속
    await homePage.goto();

    // When: 페이지가 로드되고 필터가 적용되지 않은 상태
    await page.waitForLoadState('networkidle');
    await homePage.cityGrid.waitForUpdate();

    // Then: 모든 도시 카드들이 표시되어야 함
    const cityCount = await homePage.cityGrid.getCityCount();

    // 최소 1개 이상의 도시가 있어야 함 (실제 DB에 데이터가 있다고 가정)
    expect(cityCount).toBeGreaterThan(0);

    // 도시 카드들이 실제로 렌더링되어 있는지 확인
    const cityCards = await homePage.cityGrid.getCityCards();
    expect(cityCards.length).toBe(cityCount);

    // 첫 번째 도시 카드가 보이는지 확인
    if (cityCards.length > 0) {
      const firstCard = cityCards[0];
      await expect(firstCard.card).toBeVisible();
    }
  });

  test('홈페이지의 모든 주요 요소가 함께 표시되어야 함', async ({ page }) => {
    // Given & When: 사용자가 홈페이지에 접속
    await homePage.goto();
    await page.waitForLoadState('networkidle');

    // Then: 로고, 필터 사이드바, 도시 그리드가 모두 표시되어야 함
    await expect(homePage.navigation.logo).toBeVisible();

    const cityCount = await homePage.cityGrid.getCityCount();
    expect(cityCount).toBeGreaterThan(0);

    const filterCount = await homePage.filterSidebar.getActiveFilterCount();
    expect(filterCount).toBe(0);
  });
});
