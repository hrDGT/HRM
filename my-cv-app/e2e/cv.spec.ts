import { test, expect, Page } from '@playwright/test';

async function login(page: Page, email: string, password: string, role: 'admin' | 'employee' = 'employee') {
  
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/cvs');
  
}

test.describe('CV Application E2E', () => {
  test.describe('Unauthenticated user', () => {
    test('redirects to login when accessing /cvs', async ({ page }) => {
      await page.goto('/cvs');
      await expect(page).toHaveURL('/login');
    });

    test('redirects to login when accessing CV details', async ({ page }) => {
      await page.goto('/cvs/1');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Regular Employee', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'employee@example.com', 'password123', 'employee');
    });

    test('can view CV list', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('CVs');
      await expect(page.locator('table, .divide-y')).toBeVisible();
    });

    test('can create a new CV', async ({ page }) => {
      await page.click('button:has-text("CREATE CV")');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      await page.fill('input[name="title"]', 'My Test CV');
      await page.fill('input[name="education"]', 'Test University');
      await page.fill('textarea[name="description"]', 'This is a test CV description.');
      
      await page.click('button:has-text("Create")');
      
      await expect(page.locator('[role="dialog"]')).toBeHidden();
      await expect(page.locator('text=My Test CV')).toBeVisible();
    });

    test('can edit own CV', async ({ page }) => {
      const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
      await cvRow.locator('button:has(svg)').click();
      await page.click('button:has-text("Edit")');
      
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await page.fill('input[name="title"]', 'Updated CV Title');
      await page.click('button:has-text("Update")');
      
      await expect(page.locator('[role="dialog"]')).toBeHidden();
      await expect(page.locator('text=Updated CV Title')).toBeVisible();
    });

    test('can delete own CV', async ({ page }) => {
      const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
      await cvRow.locator('button:has(svg)').click();
      await page.click('button:has-text("Delete")');
      
      await expect(page.locator('text=Are you sure you want to delete CV')).toBeVisible();
      await page.click('button:has-text("Confirm")');
      
      await expect(page.locator('text=My Test CV')).toBeHidden();
    });

    test('cannot edit or delete another user\'s CV', async ({ page }) => {
      const otherCvRow = page.locator('div', { hasText: 'admin@example.com' }).first();
      await otherCvRow.locator('button:has(svg)').click();
      
      await expect(page.locator('button:has-text("Edit")')).toBeHidden();
      await expect(page.locator('button:has-text("Delete")')).toBeHidden();
    });

    test('can view CV details page', async ({ page }) => {
      await page.click('a:has-text("My Test CV")'); 
      await expect(page).toHaveURL(/\/cvs\/[^/]+$/);
      await expect(page.locator('h1')).toContainText('My Test CV');
      await expect(page.locator('text=Education')).toBeVisible();
    });

    test('can export CV as PDF', async ({ page }) => {
      await page.goto('/cvs/1'); 
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("EXPORT")');
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.pdf');
    });
  });

  test.describe('Admin User', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'admin@example.com', 'adminpass', 'admin');
    });

    test('can edit any CV', async ({ page }) => {
      const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
      await cvRow.locator('button:has(svg)').click();
      await page.click('button:has-text("Edit")');
      
      await page.fill('input[name="title"]', 'Admin Edited Title');
      await page.click('button:has-text("Update")');
      await expect(page.locator('text=Admin Edited Title')).toBeVisible();
    });

    test('can delete any CV', async ({ page }) => {
      const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
      await cvRow.locator('button:has(svg)').click();
      await page.click('button:has-text("Delete")');
      await page.click('button:has-text("Confirm")');
      await expect(page.locator('text=Admin Edited Title')).toBeHidden();
    });

    test('sees all CVs', async ({ page }) => {
      await expect(page.locator('div', { hasText: 'admin@example.com' })).toBeVisible();
      await expect(page.locator('div', { hasText: 'employee@example.com' })).toBeVisible();
    });
  });

  test.describe('CV Details - Skills & Projects', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'employee@example.com', 'password123');
      await page.goto('/cvs/1'); 
    });

    test('can add and remove skills', async ({ page }) => {
      await page.click('button:has-text("SKILLS")');
      await page.click('button:has-text("ADD SKILL")');
      
      await page.fill('input[name="name"]', 'Playwright');
      await page.selectOption('select', 'Proficient');
      await page.click('button:has-text("Add")');
      
      await expect(page.locator('text=Playwright')).toBeVisible();
      
      await page.click('div:has-text("Playwright")');
      await page.click('button:has-text("REMOVE")');
      await expect(page.locator('text=Playwright')).toBeHidden();
    });

    test('can add and edit a project', async ({ page }) => {
      await page.click('button:has-text("PROJECTS")');
      await page.click('button:has-text("ADD PROJECT")');
      
      await page.fill('input[name="name"]', 'E2E Test Project');
      await page.fill('input[name="domain"]', 'Testing');
      await page.fill('input[name="startDate"]', '2024-01-01');
      await page.fill('textarea[name="description"]', 'Project description');
      await page.fill('textarea[name="bulletPoints"]', '- Task 1\n- Task 2');
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text=E2E Test Project')).toBeVisible();
      
      await page.click('div:has-text("E2E Test Project") >> button[aria-label="More"]');
      await page.click('button:has-text("Edit")');
      await page.fill('input[name="name"]', 'Updated E2E Project');
      await page.click('button:has-text("Save")');
      await expect(page.locator('text=Updated E2E Project')).toBeVisible();
    });
  });
});