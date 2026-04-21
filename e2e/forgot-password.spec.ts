import { expect, test } from '@playwright/test';

import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);
const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

test.describe('Forgot Password Flow', () => {
  const testEmail = 'admin@test.com';

  test.beforeEach(async ({ context }) => {
    await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);
  });

  test('Should successfully request a password reset link and redirect to login', async ({ page }) => {
    await page.goto('/forgot-password');

    const emailInput = page.getByPlaceholder(t('Common.fields.email'));
    await emailInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(testEmail, { delay: 30 });

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: t('Auth.forgotPassword.submitAction') });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(t('Auth.forgotPassword.success'))).toBeVisible({ timeout: 10000 });

    await expect(page).toHaveURL(/.*\/auth\/login/, { timeout: 10000 });
  });

  test('Should show validation error for invalid email format', async ({ page }) => {
    await page.goto('/forgot-password');

    const emailInput = page.getByPlaceholder(t('Common.fields.email'));
    await emailInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type('not-an-email', { delay: 30 });

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: t('Auth.forgotPassword.submitAction') });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(t('Common.validation.invalidEmail'))).toBeVisible();
  });

  test('Should navigate back to login page via "Cancel" link', async ({ page }) => {
    await page.goto('/forgot-password');

    const cancelBtn = page.getByRole('link', { name: t('Auth.forgotPassword.cancelAction') });
    await cancelBtn.scrollIntoViewIfNeeded();
    await cancelBtn.click({ force: true });

    await expect(page).toHaveURL(/.*\/auth\/login/, { timeout: 10000 });
  });
});