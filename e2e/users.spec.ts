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

test.describe('Users', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'NEXT_LOCALE',
        value: locale,
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('Employees list - Admin sees table and controls', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    await expect(
      page.locator('main').getByText(t('Users.title'), { exact: true })
    ).toBeVisible({ timeout: 15000 });

    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

    const createBtn = page.getByTestId('create-user-button');
    await expect(createBtn).toBeVisible();

    await expect(
      page.locator('tbody tr').first().locator('td').last().locator('span, button').first()
    ).toBeVisible();
  });

  test('Employees list - Regular user does not see control buttons', async ({ page }) => {
    await robustLogin(page, 'user@test.com', '12345');
    await page.goto('/users');

    await expect(
      page.locator('main').getByText(t('Users.title'), { exact: true })
    ).toBeVisible({ timeout: 15000 });

    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

    await expect(page.getByTestId('create-user-button')).toHaveCount(0);
    await expect(
      page.locator('tbody tr').locator('td').last().locator('span, button')
    ).toHaveCount(0);
  });

  test('Search and filter', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    await expect(page.locator('main').getByText(t('Users.title'), { exact: true })).toBeVisible({ timeout: 15000 });

    const searchInput = page.getByPlaceholder(t('Common.placeholders.search'));
    await searchInput.fill('NonExistentUser999XYZ');
    await page.keyboard.press('Enter');

    await expect(page.getByText(t('Users.noResults'))).toBeVisible({ timeout: 10000 });
  });

  test('Create User Modal - opens and validates required fields', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    await page.getByTestId('create-user-button').click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const createBtn = modal.getByRole('button', { name: t('Common.actions.create'), exact: true });
    await expect(createBtn).toBeDisabled();

    const inputs = modal.locator('input');
    await inputs.nth(0).fill(`test-${Date.now()}@test.com`);
    await inputs.nth(1).fill('securePass123');
    await inputs.nth(2).fill('Test');
    await inputs.nth(3).fill('User');

    await expect(createBtn).toBeEnabled();

    await modal.getByRole('button', { name: t('Common.actions.cancel') }).click();
    await expect(modal).not.toBeVisible();
  });

  test('Update User Modal - opens with data and cancels', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

    await page.locator('tbody tr').first().locator('td').last().locator('span, button').first().click();
    await page.getByRole('menuitem', { name: t('Users.updateAction') }).click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await modal.getByRole('button', { name: t('Common.actions.cancel') }).click();
    await expect(modal).not.toBeVisible();
  });

  test('Employee Profile - navigation and tabs', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

    await page.locator('tbody tr').first().click();
    await expect(page).toHaveURL(/\/users\/\d+/, { timeout: 15000 });

    await expect(page.getByRole('button', { name: t('Users.tabs.profile') })).toBeVisible();

    await page.getByRole('button', { name: t('Users.tabs.skills') }).click();
    await expect(page.locator('main').getByText('TODO', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: t('Users.tabs.languages') }).click();
    await expect(page.locator('main').getByText('TODO', { exact: true })).toBeVisible();
  });

  test('Validation during user creation', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    await page.getByTestId('create-user-button').click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const inputs = modal.locator('input');
    await inputs.nth(2).fill('A');
    
    const createBtn = modal.getByRole('button', { name: t('Common.actions.create'), exact: true });
    await expect(createBtn).toBeDisabled();
  });
});

test.describe('/users/me redirect', () => {
  test('redirects to /users/[id] when logged in', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users/me');
    await expect(page).toHaveURL(/\/users\/\d+/, { timeout: 15000 });
  });

  test('redirects to /auth/login when not authenticated', async ({ page }) => {
    await page.goto('/users/me');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
  });
});

test.describe('Sidebar layout', () => {
  test('sidebar shows navigation items', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    await expect(sidebar.getByText(t('Users.title'))).toBeVisible({ timeout: 15000 });
    await expect(sidebar.getByText(t('Users.nav.skills'))).toBeVisible();
    await expect(sidebar.getByText(t('Users.nav.languages'))).toBeVisible();
    await expect(sidebar.getByText(t('Users.nav.cvs'))).toBeVisible();
  });

  test('collapse button hides nav labels', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    const collapseBtn = sidebar.locator('button').filter({ has: sidebar.locator('svg').first() });

    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await expect(sidebar.getByText(t('Users.title'))).not.toBeVisible();
    }
  });

  test('current user info visible in sidebar', async ({ page }) => {
    await robustLogin(page, 'admin@test.com', '12345');
    await page.goto('/users');

    const sidebar = page.locator('aside');
    await expect(sidebar.locator('a[href="/users/me"]')).toBeVisible({ timeout: 15000 });
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
});
