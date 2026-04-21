import { expect, test } from '@playwright/test';
import crypto from 'crypto';

import { getT } from './utils/translate';

const locale = (process.env.LOCALE as 'en' | 'ru' | 'de') || 'en';
const t = getT(locale);

const selectAll = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';

test.describe('Authentication Happy Path', () => {
  const uniqueId = crypto.randomUUID().split('-')[0];
  const testEmail = `e2e_user_${uniqueId}@mailinator.com`;
  const testPassword = '12345';

  const ADMIN_EMAIL = 'admin@test.com';
  const ADMIN_PASSWORD = '12345';

  test.afterAll(async ({ request }) => {
    const adminLogin = await request.post('http://localhost:3001/api/graphql', {
      data: {
        query: `query AdminLogin($auth: AuthInput!) { login(auth: $auth) { access_token } }`,
        variables: { auth: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } },
      },
    });
    const { data: adminData } = await adminLogin.json();
    const adminToken = adminData?.login?.access_token;

    const testUserLogin = await request.post('http://localhost:3001/api/graphql', {
      data: {
        query: `query GetId($auth: AuthInput!) { login(auth: $auth) { user { id } } }`,
        variables: { auth: { email: testEmail, password: testPassword } },
      },
    });
    const { data: testUserData } = await testUserLogin.json();
    const testUserId = testUserData?.login?.user?.id;

    if (adminToken && testUserId) {
      await request.post('http://localhost:3001/api/graphql', {
        headers: { 'Authorization': `Bearer ${adminToken}` },
        data: {
          query: `mutation Del($userId: ID!) { deleteUser(userId: $userId) { __typename } }`,
          variables: { userId: testUserId },
        },
      });
      console.log(`🧹 Deleted test user: ${testEmail}`);
    }
  });

  test('Signup and Login Flow', async ({ page, context }) => {
    await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);

    await page.goto('/auth/signup');

    const emailInput = page.getByPlaceholder(t('Common.fields.email'));
    const passwordInput = page.getByPlaceholder(t('Common.fields.password'));

    await emailInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(testEmail, { delay: 30 });

    await passwordInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(testPassword, { delay: 30 });

    const signupButton = page.getByRole('button', { name: t('Auth.signUp.submitAction') });
    await signupButton.scrollIntoViewIfNeeded();
    await signupButton.click({ force: true });

    await expect(page).toHaveURL(/.*\/users/, { timeout: 10000 });

    await page.context().clearCookies();
    await page.evaluate(() => window.localStorage.clear());

    await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, domain: 'localhost', path: '/' }]);
    await page.goto('/auth/login');

    const loginEmailInput = page.getByPlaceholder(t('Common.fields.email'));
    const loginPasswordInput = page.getByPlaceholder(t('Common.fields.password'));

    await loginEmailInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(testEmail, { delay: 30 });

    await loginPasswordInput.click();
    await page.keyboard.press(selectAll);
    await page.keyboard.press('Backspace');
    await page.keyboard.type(testPassword, { delay: 30 });

    const loginButton = page.getByRole('button', { name: t('Auth.login.submitAction') });
    await loginButton.scrollIntoViewIfNeeded();
    await loginButton.click({ force: true });

    await expect(page).toHaveURL(/.*\/users/, { timeout: 10000 });
  });
});