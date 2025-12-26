import { Page, Locator } from '@playwright/test';

export class NavigationComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly themeToggle: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly logoutButton: Locator;
  readonly userEmail: Locator;
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a[href="/"]').first();
    this.themeToggle = page.locator('button[aria-label*="테마"]').or(page.locator('[data-testid="theme-toggle"]'));
    this.loginButton = page.locator('a[href="/login"]:has-text("로그인")');
    this.registerButton = page.locator('a[href="/register"]:has-text("회원가입")');
    this.logoutButton = page.locator('button:has-text("로그아웃")');
    this.userEmail = page.locator('text=@').first();
    this.mobileMenuButton = page.locator('button[aria-label*="menu"], button:has(svg[class*="menu"])');
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForURL('/');
  }

  async clickLogin() {
    await this.loginButton.click();
    await this.page.waitForURL('/login');
  }

  async clickRegister() {
    await this.registerButton.click();
    await this.page.waitForURL('/register');
  }

  async clickLogout() {
    await this.logoutButton.click();
    await this.page.waitForURL('/');
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  async getUserEmail(): Promise<string | null> {
    if (await this.userEmail.isVisible()) {
      return await this.userEmail.textContent();
    }
    return null;
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await this.page.waitForTimeout(300); // Animation
  }
}
