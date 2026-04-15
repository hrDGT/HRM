import { expect, test } from '@playwright/test';
import crypto from 'crypto';

import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);

test('Departments CRUD', async ({ page, context }) => {
  const runId = crypto.randomUUID().slice(0, 8);
  const NEW = `QA Department ${runId}`;
  const UPDATED = `DevOps Department ${runId}`;

  const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

  await context.addCookies([
    {
      name: 'NEXT_LOCALE',
      value: locale,
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.goto('/auth/login');
  await page.waitForLoadState('domcontentloaded');

  const email = page.getByPlaceholder(/Email/i);
  const password = page.getByPlaceholder(/Password/i);
  const loginBtn = page.getByRole('button', { name: /log in/i });

  await email.click();
  await page.keyboard.press(selectAll);
  await page.keyboard.press('Backspace');
  await page.keyboard.type('admin@test.com', { delay: 30 });
  await expect(email).toHaveValue('admin@test.com');

  await password.click();
  await page.keyboard.press(selectAll);
  await page.keyboard.press('Backspace');
  await page.keyboard.type('12345', { delay: 30 });
  await expect(password).toHaveValue('12345');

  await expect(loginBtn).toBeEnabled();
  await loginBtn.click();

  await expect(page).not.toHaveURL(/.*\/auth\/login/, { timeout: 15000 });

  await page.goto('/departments');

  await expect(
    page.getByRole('heading', { name: t('Departments.title') })
  ).toBeVisible({ timeout: 15000 }).catch(() => { });

  const createBtn = page.getByRole('button', { name: t('Departments.createButton') });
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

  await createdRow.first().getByRole('button', { name: t('Departments.openMenu') }).click();
  await page.getByRole('menuitem', { name: t('Departments.updateAction') }).click();

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

  await updatedRow.first().getByRole('button', { name: t('Departments.openMenu') }).click();
  await page.getByRole('menuitem', { name: t('Departments.deleteAction') }).click();

  const alertModal = page.getByRole('dialog');
  await expect(alertModal).toBeVisible();

  await alertModal.getByRole('button', { name: t('Common.actions.confirm'), exact: true }).click();

  await expect(updatedRow.first()).toBeHidden({ timeout: 15000 });
});