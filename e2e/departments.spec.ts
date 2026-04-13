import { expect, test } from '@playwright/test';
import crypto from 'crypto';

test('Departments CRUD', async ({ page }) => {
  const runId = crypto.randomUUID().slice(0, 8);
  const NEW = `QA Department ${runId}`;
  const UPDATED = `DevOps Department ${runId}`;

  const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

  // ================= LOGIN =================
  await page.goto('/auth/login');
  await page.waitForLoadState('domcontentloaded');

  const email = page.getByPlaceholder('Email');
  const password = page.getByPlaceholder('Password');
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

  // ================= DEPARTMENTS =================
  await page.goto('/departments');

  await expect(
    page.getByRole('heading', { name: /departments/i })
  ).toBeVisible({ timeout: 15000 }).catch(() => { });

  const createBtn = page.getByRole('button', { name: /create department/i });
  await expect(createBtn).toBeVisible();

  // ================= CREATE =================
  await createBtn.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  const nameInput = dialog.getByPlaceholder('Name');

  await nameInput.click();
  await page.keyboard.press(selectAll);
  await page.keyboard.press('Backspace');
  await page.keyboard.type(NEW, { delay: 20 });

  await dialog.getByRole('button', { name: /^create$/i }).click();

  const createdRow = page.locator('tr').filter({
    has: page.locator('td', { hasText: NEW }),
  });
  await expect(createdRow.first()).toBeVisible({ timeout: 15000 });

  // ================= UPDATE =================
  await createdRow.first().getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('menuitem', { name: /update department/i }).click();

  await expect(dialog).toBeVisible();

  const editInput = dialog.getByPlaceholder('Name');

  await editInput.click();
  await page.keyboard.press(selectAll);
  await page.keyboard.press('Backspace');
  await page.keyboard.type(UPDATED, { delay: 20 });

  await dialog.getByRole('button', { name: /^update$/i }).click();

  await expect(createdRow.first()).toBeHidden({ timeout: 15000 });

  const updatedRow = page.locator('tr').filter({
    has: page.locator('td', { hasText: UPDATED }),
  });
  await expect(updatedRow.first()).toBeVisible({ timeout: 15000 });

  // ================= DELETE =================
  await updatedRow.first().getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('menuitem', { name: /delete department/i }).click();

  await expect(updatedRow.first()).toBeHidden({ timeout: 15000 });
});