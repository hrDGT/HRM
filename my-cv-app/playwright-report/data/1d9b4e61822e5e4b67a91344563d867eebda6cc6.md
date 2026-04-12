# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cv.spec.ts >> CV Application E2E >> Admin User >> can edit any CV
- Location: e2e/cv.spec.ts:103:9

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | async function login(page: Page, email: string, password: string, role: 'admin' | 'employee' = 'employee') {
  4   |   
> 5   |   await page.goto('/login');
      |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  6   |   await page.fill('input[name="email"]', email);
  7   |   await page.fill('input[name="password"]', password);
  8   |   await page.click('button[type="submit"]');
  9   |   await page.waitForURL('/cvs');
  10  |   
  11  | }
  12  | 
  13  | test.describe('CV Application E2E', () => {
  14  |   test.describe('Unauthenticated user', () => {
  15  |     test('redirects to login when accessing /cvs', async ({ page }) => {
  16  |       await page.goto('/cvs');
  17  |       await expect(page).toHaveURL('/login');
  18  |     });
  19  | 
  20  |     test('redirects to login when accessing CV details', async ({ page }) => {
  21  |       await page.goto('/cvs/1');
  22  |       await expect(page).toHaveURL('/login');
  23  |     });
  24  |   });
  25  | 
  26  |   test.describe('Regular Employee', () => {
  27  |     test.beforeEach(async ({ page }) => {
  28  |       await login(page, 'employee@example.com', 'password123', 'employee');
  29  |     });
  30  | 
  31  |     test('can view CV list', async ({ page }) => {
  32  |       await expect(page.locator('h1')).toHaveText('CVs');
  33  |       await expect(page.locator('table, .divide-y')).toBeVisible();
  34  |     });
  35  | 
  36  |     test('can create a new CV', async ({ page }) => {
  37  |       await page.click('button:has-text("CREATE CV")');
  38  |       await expect(page.locator('[role="dialog"]')).toBeVisible();
  39  |       
  40  |       await page.fill('input[name="title"]', 'My Test CV');
  41  |       await page.fill('input[name="education"]', 'Test University');
  42  |       await page.fill('textarea[name="description"]', 'This is a test CV description.');
  43  |       
  44  |       await page.click('button:has-text("Create")');
  45  |       
  46  |       await expect(page.locator('[role="dialog"]')).toBeHidden();
  47  |       await expect(page.locator('text=My Test CV')).toBeVisible();
  48  |     });
  49  | 
  50  |     test('can edit own CV', async ({ page }) => {
  51  |       const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
  52  |       await cvRow.locator('button:has(svg)').click();
  53  |       await page.click('button:has-text("Edit")');
  54  |       
  55  |       await expect(page.locator('[role="dialog"]')).toBeVisible();
  56  |       await page.fill('input[name="title"]', 'Updated CV Title');
  57  |       await page.click('button:has-text("Update")');
  58  |       
  59  |       await expect(page.locator('[role="dialog"]')).toBeHidden();
  60  |       await expect(page.locator('text=Updated CV Title')).toBeVisible();
  61  |     });
  62  | 
  63  |     test('can delete own CV', async ({ page }) => {
  64  |       const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
  65  |       await cvRow.locator('button:has(svg)').click();
  66  |       await page.click('button:has-text("Delete")');
  67  |       
  68  |       await expect(page.locator('text=Are you sure you want to delete CV')).toBeVisible();
  69  |       await page.click('button:has-text("Confirm")');
  70  |       
  71  |       await expect(page.locator('text=My Test CV')).toBeHidden();
  72  |     });
  73  | 
  74  |     test('cannot edit or delete another user\'s CV', async ({ page }) => {
  75  |       const otherCvRow = page.locator('div', { hasText: 'admin@example.com' }).first();
  76  |       await otherCvRow.locator('button:has(svg)').click();
  77  |       
  78  |       await expect(page.locator('button:has-text("Edit")')).toBeHidden();
  79  |       await expect(page.locator('button:has-text("Delete")')).toBeHidden();
  80  |     });
  81  | 
  82  |     test('can view CV details page', async ({ page }) => {
  83  |       await page.click('a:has-text("My Test CV")'); 
  84  |       await expect(page).toHaveURL(/\/cvs\/[^/]+$/);
  85  |       await expect(page.locator('h1')).toContainText('My Test CV');
  86  |       await expect(page.locator('text=Education')).toBeVisible();
  87  |     });
  88  | 
  89  |     test('can export CV as PDF', async ({ page }) => {
  90  |       await page.goto('/cvs/1'); 
  91  |       const downloadPromise = page.waitForEvent('download');
  92  |       await page.click('button:has-text("EXPORT")');
  93  |       const download = await downloadPromise;
  94  |       expect(download.suggestedFilename()).toContain('.pdf');
  95  |     });
  96  |   });
  97  | 
  98  |   test.describe('Admin User', () => {
  99  |     test.beforeEach(async ({ page }) => {
  100 |       await login(page, 'admin@example.com', 'adminpass', 'admin');
  101 |     });
  102 | 
  103 |     test('can edit any CV', async ({ page }) => {
  104 |       const cvRow = page.locator('div', { hasText: 'employee@example.com' }).first();
  105 |       await cvRow.locator('button:has(svg)').click();
```