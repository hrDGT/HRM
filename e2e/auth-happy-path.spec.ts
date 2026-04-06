import { test, expect } from '@playwright/test';
import crypto from 'crypto';

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

  test('Signup and Login Flow', async ({ page }) => {
    await page.goto('/auth/signup');

    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(testEmail);

    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill(testPassword);

    const signupButton = page.getByRole('button', { name: 'Create account' });
    await signupButton.scrollIntoViewIfNeeded();
    await signupButton.click({ force: true });

    await expect(page).toHaveURL('/', { timeout: 10000 });

    await page.context().clearCookies();
    await page.evaluate(() => window.localStorage.clear());

    await page.goto('/auth/login');

    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(testEmail);

    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill(testPassword);

    const loginButton = page.getByRole('button', { name: 'Log in' });
    await loginButton.scrollIntoViewIfNeeded();
    await loginButton.click({ force: true });

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});