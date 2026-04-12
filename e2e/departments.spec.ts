import { expect, test } from '@playwright/test';
import crypto from 'crypto';

test.describe('Departments Management (E2E)', () => {
  test.describe.configure({ timeout: 60_000 });

  test('Should create and update department', async ({ page }) => {
    const runId = crypto.randomUUID().slice(0, 8);
    const NEW_DEPT_NAME = `QA Department ${runId}`;
    const UPDATED_DEPT_NAME = `DevOps Department ${runId}`;

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/auth/login');

    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('admin@test.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('12345');

    const loginButton = page.getByRole('button', { name: 'Log in' });
    await loginButton.scrollIntoViewIfNeeded();
    await loginButton.click({ force: true });
    await expect(page).toHaveURL('/', { timeout: 15000 });

    await page.goto('/departments', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Departments' })).toBeVisible({
      timeout: 15000,
    });

    const createBtn = page.getByRole('button', { name: /Create department/i });
    await createBtn.click();
    const createDialog = page.getByRole('dialog', { name: /Create Department/i });
    await expect(createDialog).toBeVisible();

    const nameInput = createDialog.getByPlaceholder('Name');
    await nameInput.fill(NEW_DEPT_NAME);

    await createDialog.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(createDialog).toBeHidden({ timeout: 15000 });
    await expect(page.locator('tr').filter({ hasText: NEW_DEPT_NAME })).toBeVisible({
      timeout: 15000,
    });

    const row = page.locator('tr').filter({ hasText: NEW_DEPT_NAME });
    await row.getByRole('button', { name: 'Open menu' }).click();

    await page.getByRole('menuitem', { name: /Update department/i }).click();

    const editDialog = page.getByRole('dialog', { name: /Update Department/i });
    await expect(editDialog).toBeVisible();
    const editInput = editDialog.getByPlaceholder('Name');
    await editInput.clear();
    await editInput.fill(UPDATED_DEPT_NAME);

    await editDialog.getByRole('button', { name: 'Update', exact: true }).click();

    await expect(editDialog).toBeHidden({ timeout: 15000 });
    await expect(page.locator('tr').filter({ hasText: UPDATED_DEPT_NAME })).toBeVisible({
      timeout: 15000,
    });
  });
});