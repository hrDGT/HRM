import { expect, test } from '@playwright/test';

import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);
const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

test.describe('Reset Password Flow', () => {
  const resetUrl = '/reset-password?token=fake-jwt-token-123';

  test.beforeEach(async ({ context }) => {
    await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);
  });

  test('Should navigate back to login page via link', async ({ page }) => {
    await page.goto(resetUrl);

    const backLink = page.getByRole('link', { name: t('Auth.resetPassword.backToLoginAction') });
    await backLink.scrollIntoViewIfNeeded();
    await backLink.click({ force: true });

    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });
  });

  test('Should show client validation error for weak password', async ({ page }) => {
    await page.goto(resetUrl);

    const passwordInput = page.getByPlaceholder(t('Common.fields.newPassword'));
    await passwordInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type('123', { delay: 30 });

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: t('Auth.resetPassword.submitAction') });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(t('Common.validation.passwordMinLength'))).toBeVisible();
  });

  test('Should show server error for invalid token', async ({ page }) => {
    await page.goto(resetUrl);

    const passwordInput = page.getByPlaceholder(t('Common.fields.newPassword'));
    await passwordInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type('StrongPassword123!', { delay: 30 });

    await page.keyboard.press('Escape');

    const submitBtn = page.getByRole('button', { name: t('Auth.resetPassword.submitAction') });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByText(/Action expired/i)).toBeVisible({ timeout: 10000 });
  });
});