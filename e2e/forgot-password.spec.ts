import { test, expect } from '@playwright/test';

test.describe('Forgot Password Flow', () => {
  const testEmail = 'admin@test.com';

  test('Should successfully request a password reset link and redirect to login', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(testEmail);

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: /Reset Password/i });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });
  });

  test('Should show validation error for invalid email format', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('not-an-email');

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: /Reset Password/i });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(/Invalid email/i)).toBeVisible();
  });

  test('Should navigate back to login page via "Cancel" link', async ({ page }) => {
    await page.goto('/forgot-password');

    const cancelBtn = page.getByText(/Cancel/i);
    await cancelBtn.scrollIntoViewIfNeeded();
    await cancelBtn.click({ force: true });

    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });
  });
});