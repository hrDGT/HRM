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

async function goToProfileTab(page: Page, userId: string, tabName: string) {
  await page.goto(`/users/${userId}`);
  await page.getByRole('link', { name: tabName }).click();
  await expect(page).toHaveURL(new RegExp(`/users/${userId}/(skills|languages)`), { timeout: 10000 });
}

test.describe('User Skills & Languages', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' },
    ]);
  });

  test.describe('Skills Tab', () => {
    test('Admin: can add a new skill via modal', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.skills'));

      const addBtn = page.getByRole('button', { name: t('Users.addSkill') });
      await expect(addBtn).toBeVisible();
      await addBtn.click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await expect(modal.getByText(t('Users.skillModal.addTitle'))).toBeVisible();

      const confirmBtn = modal.getByRole('button', { name: t('Users.skillModal.confirm') });
      await expect(confirmBtn).toBeDisabled();

      const skillSelect = modal.getByRole('combobox', { name: t('Users.skillModal.skill') });
      await skillSelect.selectOption({ label: 'React' });

      const masterySelect = modal.getByRole('combobox', { name: t('Users.skillModal.mastery') });
      await masterySelect.selectOption('Advanced');

      await expect(confirmBtn).toBeEnabled();
      await confirmBtn.click();

      await expect(modal).not.toBeVisible({ timeout: 5000 });
      await expect(page.getByText('React')).toBeVisible({ timeout: 10000 });
    });

    test('Admin: can update an existing skill', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.skills'));

      await expect(page.getByText('React')).toBeVisible({ timeout: 10000 });
      await page.getByText('React').click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await expect(modal.getByText(t('Users.skillModal.updateTitle'))).toBeVisible();

      const skillSelect = modal.getByRole('combobox', { name: t('Users.skillModal.skill') });
      await expect(skillSelect).toBeDisabled();

      const masterySelect = modal.getByRole('combobox', { name: t('Users.skillModal.mastery') });
      await masterySelect.selectOption('Expert');

      await modal.getByRole('button', { name: t('Users.skillModal.confirm') }).click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      await page.reload();
      await expect(page.getByText('React')).toBeVisible();
    });

    test('Admin: can delete skills via selection mode', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.skills'));

      await expect(page.getByText('React')).toBeVisible({ timeout: 10000 });

      const deleteBtn = page.getByRole('button', { name: t('Users.removeSelected') });
      await deleteBtn.click();

      await expect(page.getByRole('button', { name: t('Users.cancelSelection') })).not.toBeVisible();

      await page.getByText('React').click();
      
      await expect(page.getByRole('button', { name: t('Users.cancelSelection') })).toBeVisible();
      await expect(page.getByText('1')).toBeVisible();

      await page.getByRole('button', { name: t('Users.removeSelected') }).click();

      await expect(page.getByText('React')).not.toBeVisible({ timeout: 10000 });
    });

    test('Regular user: cannot see edit controls on skills', async ({ page }) => {
      await robustLogin(page, 'user@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.skills'));

      await expect(page.getByText('React')).toBeVisible({ timeout: 10000 });

      await expect(page.getByRole('button', { name: t('Users.addSkill') })).not.toBeVisible();
      await expect(page.getByRole('button', { name: t('Users.removeSelected') })).not.toBeVisible();

      await page.getByText('React').click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('Modal: cancel button closes modal without changes', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.skills'));

      await page.getByRole('button', { name: t('Users.addSkill') }).click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      const skillSelect = modal.getByRole('combobox', { name: t('Users.skillModal.skill') });
      await skillSelect.selectOption({ label: 'TypeScript' });

      await modal.getByRole('button', { name: t('Users.skillModal.cancel') }).click();
      await expect(modal).not.toBeVisible();

      await expect(page.getByText('TypeScript')).not.toBeVisible();
    });
  });

  test.describe('Languages Tab', () => {
    test('Admin: can add a new language via modal', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.languages'));

      const addBtn = page.getByRole('button', { name: t('Users.addLanguage') });
      await expect(addBtn).toBeVisible();
      await addBtn.click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await expect(modal.getByText(t('Users.languageModal.addTitle'))).toBeVisible();

      const confirmBtn = modal.getByRole('button', { name: t('Users.languageModal.confirm') });
      await expect(confirmBtn).toBeDisabled();

      const langSelect = modal.getByRole('combobox', { name: t('Users.languageModal.language') });
      await langSelect.selectOption({ label: 'English' });

      const profSelect = modal.getByRole('combobox', { name: t('Users.languageModal.proficiency') });
      await profSelect.selectOption('C1');

      await expect(confirmBtn).toBeEnabled();
      await confirmBtn.click();

      await expect(modal).not.toBeVisible({ timeout: 5000 });
      await expect(page.getByText('English')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('C1')).toBeVisible();
    });

    test('Admin: can update an existing language', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.languages'));

      await expect(page.getByText('English')).toBeVisible({ timeout: 10000 });
      await page.getByText('English').click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await expect(modal.getByText(t('Users.languageModal.updateTitle'))).toBeVisible();

      const langSelect = modal.getByRole('combobox', { name: t('Users.languageModal.language') });
      await expect(langSelect).toBeDisabled();

      const profSelect = modal.getByRole('combobox', { name: t('Users.languageModal.proficiency') });
      await profSelect.selectOption('Native');

      await modal.getByRole('button', { name: t('Users.languageModal.confirm') }).click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      await page.reload();
      await expect(page.getByText('English')).toBeVisible();
      await expect(page.getByText('Native')).toBeVisible();
    });

    test('Admin: can delete languages via selection mode', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.languages'));

      await expect(page.getByText('English')).toBeVisible({ timeout: 10000 });

      const deleteBtn = page.getByRole('button', { name: t('Users.removeSelected') });
      await deleteBtn.click();

      await page.getByText('English').click();
      await expect(page.getByText('1')).toBeVisible();

      await page.getByRole('button', { name: t('Users.removeSelected') }).click();

      await expect(page.getByText('English')).not.toBeVisible({ timeout: 10000 });
    });

    test('Regular user: cannot edit languages', async ({ page }) => {
      await robustLogin(page, 'user@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.languages'));

      await expect(page.getByText('English')).toBeVisible({ timeout: 10000 });

      await expect(page.getByRole('button', { name: t('Users.addLanguage') })).not.toBeVisible();
      await expect(page.getByRole('button', { name: t('Users.removeSelected') })).not.toBeVisible();

      await page.getByText('English').click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('Empty state: shows message and add button when no languages', async ({ page }) => {      
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '999', t('Users.tabs.languages'));

      await expect(page.getByText(t('Users.noLanguages'))).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: t('Users.addFirstLanguage') })).toBeVisible();
    });
  });

  test.describe('Tab Navigation & Permissions', () => {
    test('Profile tabs switch correctly without full page reload', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await page.goto('/users/1');

      await expect(page.getByRole('link', { name: t('Users.tabs.profile') })).toHaveAttribute('aria-current', 'page', { timeout: 10000 });

      await page.getByRole('link', { name: t('Users.tabs.skills') }).click();
      await expect(page).toHaveURL('/users/1/skills');
      await expect(page.getByRole('link', { name: t('Users.tabs.skills') })).toHaveAttribute('aria-current', 'page');

      await page.getByRole('link', { name: t('Users.tabs.languages') }).click();
      await expect(page).toHaveURL('/users/1/languages');
      await expect(page.getByRole('link', { name: t('Users.tabs.languages') })).toHaveAttribute('aria-current', 'page');
    });

    test('Breadcrumb navigation works correctly', async ({ page }) => {
      await robustLogin(page, 'admin@test.com', '12345');
      await goToProfileTab(page, '1', t('Users.tabs.skills'));

      const breadcrumb = page.locator('nav').filter({ hasText: t('Users.title') });
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByRole('link', { name: t('Users.title') })).toHaveAttribute('href', '/users');
      
      await breadcrumb.getByRole('link', { name: t('Users.title') }).click();
      await expect(page).toHaveURL('/users');
    });
  });
});
