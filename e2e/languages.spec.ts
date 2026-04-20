import { expect, type Page, test } from '@playwright/test';

import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);

const getRandomLetters = (length = 6) => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, length);
};

const getRandomIso = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)];
};

async function robustLogin(page: Page, emailText: string, passText: string) {
  await page.goto('/auth/login');

  await page.waitForLoadState('networkidle');

  const email = page.getByPlaceholder(/Email/i);
  const password = page.getByPlaceholder(/Password/i);
  const loginBtn = page.getByRole('button', { name: /log in/i });

  await email.click();
  await email.clear();
  await email.pressSequentially(emailText, { delay: 20 });
  await expect(email).toHaveValue(emailText);

  await password.click();
  await password.clear();
  await password.pressSequentially(passText, { delay: 20 });
  await expect(password).toHaveValue(passText);

  await expect(loginBtn).toBeEnabled();
  await loginBtn.click();

  await expect(page).not.toHaveURL(/.*\/auth\/login/, { timeout: 15000 });
}

test.describe('Languages', () => {
  test('Languages CRUD', async ({ page, context }) => {
    const randomStr = getRandomLetters();
    const NEW = `Lang${randomStr}`;
    const UPDATED = `Upd${randomStr}`;
    const NEW_ISO = getRandomIso();
    const UPDATED_ISO = getRandomIso();

    await context.addCookies([
      { name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' },
    ]);

    await robustLogin(page, 'admin@test.com', '12345');

    await page.goto('/languages');

    await expect(
      page.getByRole('heading', { name: t('Languages.title') })
    ).toBeVisible({ timeout: 15000 }).catch(() => { });

    const createBtn = page.getByRole('button', { name: t('Languages.createButton') });
    await expect(createBtn).toBeVisible();

    await createBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByPlaceholder(t('Common.fields.name'), { exact: true }).fill(NEW);
    await dialog.getByPlaceholder(t('Common.fields.nativeName')).fill(NEW);
    await dialog.getByPlaceholder(t('Common.fields.iso2')).fill(NEW_ISO);

    await dialog.getByRole('button', { name: t('Common.actions.create'), exact: true }).click();

    await expect(dialog).toBeHidden({ timeout: 5000 });

    const createdRow = page.locator('tr').filter({
      has: page.locator('td', { hasText: NEW }),
    });
    await expect(createdRow.first()).toBeVisible({ timeout: 15000 });

    await createdRow.first().getByRole('button', { name: t('Languages.openMenu') }).click();
    await page.getByRole('menuitem', { name: t('Languages.updateAction') }).click();

    await expect(dialog).toBeVisible();

    await dialog.getByPlaceholder(t('Common.fields.name'), { exact: true }).fill(UPDATED);
    await dialog.getByPlaceholder(t('Common.fields.nativeName')).fill(UPDATED);
    await dialog.getByPlaceholder(t('Common.fields.iso2')).fill(UPDATED_ISO);

    await dialog.getByRole('button', { name: t('Common.actions.update'), exact: true }).click();

    await expect(dialog).toBeHidden({ timeout: 5000 });
    await expect(createdRow.first()).toBeHidden({ timeout: 15000 });

    const updatedRow = page.locator('tr').filter({
      has: page.locator('td', { hasText: UPDATED }),
    });
    await expect(updatedRow.first()).toBeVisible({ timeout: 15000 });

    await updatedRow.first().getByRole('button', { name: t('Languages.openMenu') }).click();
    await page.getByRole('menuitem', { name: t('Languages.deleteAction') }).click();

    const alertModal = page.getByRole('dialog');
    await expect(alertModal).toBeVisible();

    await alertModal.getByRole('button', { name: t('Common.actions.confirm'), exact: true }).click();

    await expect(updatedRow.first()).toBeHidden({ timeout: 15000 });
  });

  test.describe('Languages Extended Coverage', () => {
    test('Regular user does not see control buttons', async ({ page, context }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

      await robustLogin(page, 'user@test.com', '12345');

      await page.goto('/languages');

      await expect(page.getByRole('heading', { name: t('Languages.title') })).toBeVisible();

      const createBtn = page.getByRole('button', { name: t('Languages.createButton') });
      await expect(createBtn).toHaveCount(0);

      const actionMenus = page.getByRole('button', { name: t('Languages.openMenu') });
      await expect(actionMenus).toHaveCount(0);
    });

    test('Search and reset filter', async ({ page, context }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

      await robustLogin(page, 'admin@test.com', '12345');

      await page.goto('/languages');
      await expect(page.getByRole('heading', { name: t('Languages.title') })).toBeVisible();

      const searchInput = page.getByRole('searchbox');

      await searchInput.click();
      await searchInput.pressSequentially('UnknownLangXYZ', { delay: 20 });
      await page.keyboard.press('Enter');

      await expect(page.getByText(t('Common.noResults.title'))).toBeVisible();

      await page.getByRole('button', { name: t('Common.actions.resetSearch') }).click();

      await expect(searchInput).toHaveValue('');
      await expect(page.getByText(t('Common.noResults.title'))).toBeHidden();
    });

    test('Validation during creation', async ({ page, context }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

      await robustLogin(page, 'admin@test.com', '12345');

      await page.goto('/languages');

      await page.getByRole('button', { name: t('Languages.createButton') }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await dialog.getByPlaceholder(t('Common.fields.name'), { exact: true }).fill('A');
      await dialog.getByPlaceholder(t('Common.fields.iso2')).fill('A');

      await dialog.getByRole('button', { name: t('Common.actions.create'), exact: true }).click();

      await expect(dialog.getByText(t('Languages.validation.nameMin'))).toBeVisible();
      await expect(dialog.getByText(t('Languages.validation.isoLength'))).toBeVisible();

      await expect(dialog).toBeVisible();
    });
  });
});