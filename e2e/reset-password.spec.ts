import { test, expect } from '@playwright/test';

test.describe('Reset Password Flow', () => {
  const resetUrl = '/reset-password?token=fake-jwt-token-123';

  test('Should navigate back to login page via link', async ({ page }) => {
    await page.goto(resetUrl);

    const backLink = page.getByRole('link', { name: /Back to log in/i });
    await backLink.scrollIntoViewIfNeeded();
    await backLink.click({ force: true });

    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });
  });

  test('Should show client validation error for weak password', async ({ page }) => {
    await page.goto(resetUrl);

    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('123');

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(/Password must be at least 5 characters long/i)).toBeVisible();
  });

  test('Should show server error for invalid token', async ({ page }) => {
    await page.goto(resetUrl);

    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('StrongPassword123!');

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(/Action expired/i)).toBeVisible({ timeout: 10000 });
  });
});