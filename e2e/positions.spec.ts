import { expect, type Page, test } from '@playwright/test';
import crypto from 'crypto';

import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);

const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

async function robustLogin(page: Page, emailText: string, passText: string) {
  await page.goto('/auth/login');
  await page.waitForLoadState('domcontentloaded');

  const email = page.getByPlaceholder(t('Common.fields.email'));
  const password = page.getByPlaceholder(t('Common.fields.password'));
  const loginBtn = page.getByRole('button', { name: t('Auth.login.submitAction') });

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

test.describe('Positions', () => {
  test('Positions CRUD', async ({ page, context }) => {
    const runId = crypto.randomUUID().slice(0, 8);
    const NEW = `React Position ${runId}`;
    const UPDATED = `Next Position ${runId}`;

    await context.addCookies([
      {
        name: 'NEXT_LOCALE',
        value: locale,
        domain: 'localhost',
        path: '/',
      },
    ]);

    await robustLogin(page, 'admin@test.com', '12345');

    await page.goto('/positions');

    await expect(
      page.getByRole('heading', { name: t('Positions.title') })
    ).toBeVisible({ timeout: 15000 }).catch(() => { });

    const createBtn = page.getByRole('button', { name: t('Positions.createButton') });
    await expect(createBtn).toBeVisible();

    await createBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const nameInput = dialog.getByPlaceholder(t('Common.fields.name'));

    await nameInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(NEW, { delay: 20 });

    await dialog.getByRole('button', { name: t('Common.actions.create'), exact: true }).click();

    const createdRow = page.locator('tr').filter({
      has: page.locator('td', { hasText: NEW }),
    });
    await expect(createdRow.first()).toBeVisible({ timeout: 15000 });

    await createdRow.first().getByRole('button', { name: t('Positions.openMenu') }).click();
    await page.getByRole('menuitem', { name: t('Positions.updateAction') }).click();

    await expect(dialog).toBeVisible();

    const editInput = dialog.getByPlaceholder(t('Common.fields.name'));

    await editInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(UPDATED, { delay: 20 });

    await dialog.getByRole('button', { name: t('Common.actions.update'), exact: true }).click();

    await expect(createdRow.first()).toBeHidden({ timeout: 15000 });

    const updatedRow = page.locator('tr').filter({
      has: page.locator('td', { hasText: UPDATED }),
    });
    await expect(updatedRow.first()).toBeVisible({ timeout: 15000 });

    await updatedRow.first().getByRole('button', { name: t('Positions.openMenu') }).click();
    await page.getByRole('menuitem', { name: t('Positions.deleteAction') }).click();

    const alertModal = page.getByRole('dialog');
    await expect(alertModal).toBeVisible();

    await alertModal.getByRole('button', { name: t('Common.actions.confirm'), exact: true }).click();

    await expect(updatedRow.first()).toBeHidden({ timeout: 15000 });
  });

  test.describe('Positions Extended Coverage', () => {
    test('Regular user does not see control buttons', async ({ page, context }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

      await robustLogin(page, 'user@test.com', '12345');

      await page.goto('/positions');

      await expect(page.getByRole('heading', { name: t('Positions.title') })).toBeVisible();

      const createBtn = page.getByRole('button', { name: t('Positions.createButton') });
      await expect(createBtn).toHaveCount(0);

      const actionMenus = page.getByRole('button', { name: t('Positions.openMenu') });
      await expect(actionMenus).toHaveCount(0);
    });

    test('Search and reset filter', async ({ page, context }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

      await robustLogin(page, 'admin@test.com', '12345');

      await page.goto('/positions');
      await expect(page.getByRole('heading', { name: t('Positions.title') })).toBeVisible();

      const searchInput = page.getByRole('searchbox');

      await searchInput.click();
      await searchInput.pressSequentially('SomeNonExistentPositionName999', { delay: 20 });
      await page.keyboard.press('Enter');

      await expect(page.getByText(t('Common.noResults.title'))).toBeVisible();

      await page.getByRole('button', { name: t('Common.actions.resetSearch') }).click();

      await expect(searchInput).toHaveValue('');
      await expect(page.getByText(t('Common.noResults.title'))).toBeHidden();
    });

    test('Validation during creation', async ({ page, context }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

      await robustLogin(page, 'admin@test.com', '12345');

      await page.goto('/positions');

      await page.getByRole('button', { name: t('Positions.createButton') }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await dialog.getByPlaceholder(t('Common.fields.name')).fill('A');
      await dialog.getByRole('button', { name: t('Common.actions.create'), exact: true }).click();

      await expect(dialog.getByText(t('Positions.validation.nameMin'))).toBeVisible();
      await expect(dialog).toBeVisible();
    });
  });
});