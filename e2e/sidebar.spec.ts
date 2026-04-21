import { expect, type Page, test } from '@playwright/test';
import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);

const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

async function robustLogin(page: Page, emailText: string, passText: string) {
  await page.goto('/auth/login');
  await page.waitForLoadState('domcontentloaded');

  const email = page.getByPlaceholder(/Email/i);
  const password = page.getByPlaceholder(/Password/i);
  const loginBtn = page.getByRole('button', { name: /log in/i });

  await email.click();
  await page.keyboard.press(selectAll);
  await page.keyboard.press('Backspace');
  await page.keyboard.type(emailText, { delay: 30 });
  await expect(email).toHaveValue(emailText);

  await password.click();
  await page.keyboard.press(selectAll);
  await page.keyboard.press('Backspace');
  await page.keyboard.type(passText, { delay: 30 });
  await expect(password).toHaveValue(passText);

  await expect(loginBtn).toBeEnabled();
  await loginBtn.click();
  await expect(page).not.toHaveURL(/.*\/auth\/login/, { timeout: 15000 });
}

test.describe('Protected Layout Sidebar', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' },
    ]);
  });

  test('sidebar shows navigation items on protected route', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible({ timeout: 15000 });
    
    await expect(
      sidebar.locator('a').filter({ hasText: t('Users.title') }).first()
    ).toBeVisible();
    await expect(sidebar.locator('a').filter({ hasText: t('Users.nav.skills') }).first()).toBeVisible();
    await expect(sidebar.locator('a').filter({ hasText: t('Users.nav.languages') }).first()).toBeVisible();
    await expect(sidebar.locator('a').filter({ hasText: t('Users.nav.cvs') }).first()).toBeVisible();
  });

  test('collapse button hides nav labels', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    const collapseBtn = sidebar.locator('button').filter({ 
      has: sidebar.locator('svg').first() 
    });

    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await expect(
        sidebar.locator('a').filter({ hasText: t('Users.title') }).locator('span').first()
      ).toBeHidden();
    }
  });

  test('expand button shows nav labels again', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    const collapseBtn = sidebar.locator('button').filter({ 
      has: sidebar.locator('svg').first() 
    });

    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await collapseBtn.click();
      await expect(
        sidebar.locator('a').filter({ hasText: t('Users.title') }).locator('span').first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('current user info visible in sidebar', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    await expect(sidebar.locator('a[href="/users/me"]')).toBeVisible({ timeout: 15000 });
    await expect(
      sidebar.locator('a[href="/users/me"] span').filter({ hasText: /admin|Admin/i }).first()
    ).toBeVisible();
  });

  test('clicking user avatar navigates to profile', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    const userLink = sidebar.locator('a[href="/users/me"]');

    if (await userLink.isVisible()) {
      await userLink.click();
      await expect(page).toHaveURL(/\/users\/(me|\d+)/, { timeout: 15000 });
    }
  });

  test('active nav item has correct styling', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    const activeLink = sidebar.locator('a').filter({ hasText: t('Users.title') }).first();
    
    await expect(activeLink).toHaveClass(/bg-white\/10|text-white/);
  });

  test('nav items navigate to correct routes', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    
    await sidebar.locator('a').filter({ hasText: t('Users.nav.skills') }).first().click();
    await expect(page).toHaveURL('/skills', { timeout: 10000 });
    
    await sidebar.locator('a').filter({ hasText: t('Users.nav.languages') }).first().click();
    await expect(page).toHaveURL('/languages', { timeout: 10000 });
    
    await sidebar.locator('a').filter({ hasText: t('Users.nav.cvs') }).first().click();
    await expect(page).toHaveURL('/cvs', { timeout: 10000 });
  });

  test('sidebar persists across route changes', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    
    const routes = ['/users', '/skills', '/languages'];
    for (const route of routes) {
      await page.goto(route);
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible({ timeout: 10000 });
      await expect(sidebar.locator('a[href="/users/me"]')).toBeVisible();
    }
  });
});
