import { test, expect, Page } from "@playwright/test";

async function setUserCookie(
  page: Page,
  userId: number,
  baseURL: string
) {
  await page.context().addCookies([
    {
      name: "user_id",
      value: String(userId),
      domain: new URL(baseURL).hostname,
      path: "/",
    },
  ]);
}

const ADMIN_ID = 1;
const EMPLOYEE_ID = 2;

const MOCK_EMPLOYEES = [
  {
    id: ADMIN_ID,
    email: "admin@example.com",
    is_verified: true,
    profile: { first_name: "Alice", last_name: "Admin", avatar: null },
    department_name: "Engineering",
    position_name: "Lead",
    role: "Admin",
  },
  {
    id: EMPLOYEE_ID,
    email: "bob@example.com",
    is_verified: false,
    profile: { first_name: "Bob", last_name: "Builder", avatar: null },
    department_name: "Design",
    position_name: "Designer",
    role: "Employee",
  },
];

const MOCK_DEPARTMENTS = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Design" },
];

const MOCK_POSITIONS = [
  { id: "1", name: "Lead" },
  { id: "2", name: "Designer" },
];

async function mockGraphQL(
  page: Page,
  handlers: Record<
    string,
    (variables: Record<string, unknown>) => unknown
  >
) {
  await page.route("**/graphql", async (route) => {
    const body = route.request().postDataJSON() as {
      operationName?: string;
      query: string;
      variables?: Record<string, unknown>;
    };

    const operationName = body.operationName ?? "";
    const handler = handlers[operationName];

    if (handler) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: handler(body.variables ?? {}) }),
      });
    } else {
      await route.continue();
    }
  });
}

test.describe("Employees list (/users)", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await setUserCookie(page, ADMIN_ID, baseURL!);

    await mockGraphQL(page, {
      GetEmployees: () => ({ users: MOCK_EMPLOYEES }),
      GetCurrentUserRole: () => ({ user: { role: "Admin" } }),
    });

    await page.route("**/api/departments", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DEPARTMENTS),
      })
    );
    await page.route("**/api/positions", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_POSITIONS),
      })
    );

    await page.goto("/users");
  });

  test("renders the employee table with all employees", async ({ page }) => {
    await expect(page.getByText("Alice")).toBeVisible();
    await expect(page.getByText("Bob")).toBeVisible();
    await expect(page.getByText("admin@example.com")).toBeVisible();
    await expect(page.getByText("bob@example.com")).toBeVisible();
  });

  test("shows department badges", async ({ page }) => {
    await expect(page.getByText("Engineering")).toBeVisible();
    await expect(page.getByText("Design")).toBeVisible();
  });

  test("filters employees by first name", async ({ page }) => {
    await page.getByPlaceholder("Search").fill("Alice");
    await expect(page.getByText("Alice")).toBeVisible();
    await expect(page.getByText("Bob")).not.toBeVisible();
  });

  test("filters employees by email", async ({ page }) => {
    await page.getByPlaceholder("Search").fill("bob@");
    await expect(page.getByText("Bob")).toBeVisible();
    await expect(page.getByText("Alice")).not.toBeVisible();
  });

  test("filters employees by department", async ({ page }) => {
    await page.getByPlaceholder("Search").fill("Design");
    await expect(page.getByText("Bob")).toBeVisible();
    await expect(page.getByText("Alice")).not.toBeVisible();
  });

  test("shows empty state when no employees match the search", async ({
    page,
  }) => {
    await page.getByPlaceholder("Search").fill("nonexistent_xyz");
    await expect(page.getByText("No employees found")).toBeVisible();
  });

  test("toggles sort direction when clicking Department header", async ({
    page,
  }) => {
    const header = page.getByRole("columnheader", { name: /department/i });
    const rows = page.locator("tbody tr");

    await expect(rows.first()).toContainText("Alice");

    await header.click();

    await expect(rows.first()).toContainText("Bob");
  });

  test("navigates to employee profile on row click", async ({ page }) => {
    await page.locator("tbody tr").first().click();
    await expect(page).toHaveURL(/\/users\/\d+/);
  });

  test("Admin sees CREATE USER button", async ({ page }) => {
    await expect(
      page.getByTestId("create-user-button")
    ).toBeVisible();
  });

  test("non-Admin does NOT see CREATE USER button", async ({
    page,
    baseURL,
  }) => {
    await setUserCookie(page, EMPLOYEE_ID, baseURL!);
    await mockGraphQL(page, {
      GetEmployees: () => ({ users: MOCK_EMPLOYEES }),
      GetCurrentUserRole: () => ({ user: { role: "Employee" } }),
    });
    await page.goto("/users");
    await expect(page.getByTestId("create-user-button")).not.toBeVisible();
  });
});

test.describe("Create User Modal", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await setUserCookie(page, ADMIN_ID, baseURL!);
    await mockGraphQL(page, {
      GetEmployees: () => ({ users: MOCK_EMPLOYEES }),
      GetCurrentUserRole: () => ({ user: { role: "Admin" } }),
    });
    await page.goto("/users");
    await page.getByTestId("create-user-button").click();
  });

  test("modal opens with empty fields", async ({ page }) => {
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByLabel("Email")).toHaveValue("");
    await expect(modal.getByLabel("First Name")).toHaveValue("");
    await expect(modal.getByLabel("Last Name")).toHaveValue("");
  });

  test("Create button is disabled when required fields are empty", async ({
    page,
  }) => {
    const createBtn = page.getByRole("button", { name: /^create$/i });
    await expect(createBtn).toBeDisabled();
  });

  test("Create button enables after filling required fields", async ({
    page,
  }) => {
    const modal = page.getByRole("dialog");
    await modal.getByLabel("Email").fill("new@example.com");
    await modal.getByLabel("Password").fill("secret123");
    await modal.getByLabel("First Name").fill("Charlie");
    await modal.getByLabel("Last Name").fill("Chaplin");

    await expect(page.getByRole("button", { name: /^create$/i })).toBeEnabled();
  });

  test("creating a user adds them to the list and closes the modal", async ({
    page,
  }) => {
    const modal = page.getByRole("dialog");
    await modal.getByLabel("Email").fill("charlie@example.com");
    await modal.getByLabel("Password").fill("secret123");
    await modal.getByLabel("First Name").fill("Charlie");
    await modal.getByLabel("Last Name").fill("Chaplin");

    await page.getByRole("button", { name: /^create$/i }).click();

    await expect(modal).not.toBeVisible();
    await expect(page.getByText("charlie@example.com")).toBeVisible();
    await expect(page.getByText("Charlie")).toBeVisible();
  });

  test("Cancel button closes the modal without changes", async ({ page }) => {
    const modal = page.getByRole("dialog");
    await modal.getByLabel("Email").fill("ghost@example.com");

    await page.getByRole("button", { name: /cancel/i }).click();

    await expect(modal).not.toBeVisible();
    await expect(page.getByText("ghost@example.com")).not.toBeVisible();
  });

  test("form resets after successful creation", async ({ page }) => {
    const modal = page.getByRole("dialog");
    await modal.getByLabel("Email").fill("reset@example.com");
    await modal.getByLabel("Password").fill("pass");
    await modal.getByLabel("First Name").fill("Reset");
    await modal.getByLabel("Last Name").fill("User");
    await page.getByRole("button", { name: /^create$/i }).click();

    // Re-open
    await page.getByTestId("create-user-button").click();
    await expect(page.getByRole("dialog").getByLabel("Email")).toHaveValue("");
  });
});

// ---------------------------------------------------------------------------
// Update User Modal
// ---------------------------------------------------------------------------

test.describe("Update User Modal", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await setUserCookie(page, ADMIN_ID, baseURL!);
    await mockGraphQL(page, {
      GetEmployees: () => ({ users: MOCK_EMPLOYEES }),
      GetCurrentUserRole: () => ({ user: { role: "Admin" } }),
    });
    await page.goto("/users");

    // Open dropdown for the first employee and click "Update user"
    await page
      .locator("tbody tr")
      .first()
      .getByRole("button")
      .click({ force: true });
    await page.getByRole("menuitem", { name: /update user/i }).click();
  });

  test("modal opens pre-filled with existing employee data", async ({
    page,
  }) => {
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByLabel("Email")).toHaveValue("admin@example.com");
    await expect(modal.getByLabel("First Name")).toHaveValue("Alice");
    await expect(modal.getByLabel("Last Name")).toHaveValue("Admin");
  });

  test("updating the first name reflects in the table", async ({ page }) => {
    const modal = page.getByRole("dialog");
    await modal.getByLabel("First Name").fill("Alicia");
    await page.getByRole("button", { name: /^update$/i }).click();

    await expect(modal).not.toBeVisible();
    await expect(page.getByText("Alicia")).toBeVisible();
  });

  test("Cancel closes without persisting changes", async ({ page }) => {
    const modal = page.getByRole("dialog");
    await modal.getByLabel("First Name").fill("MODIFIED");
    await page.getByRole("button", { name: /cancel/i }).click();

    await expect(modal).not.toBeVisible();
    await expect(page.getByText("MODIFIED")).not.toBeVisible();
    await expect(page.getByText("Alice")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Employee Profile (/users/[id])
// ---------------------------------------------------------------------------

test.describe("Employee Profile (/users/[id])", () => {
  const MOCK_EMPLOYEE_DETAIL = {
    id: String(EMPLOYEE_ID),
    email: "bob@example.com",
    is_verified: false,
    created_at: "2023-01-15T00:00:00Z",
    profile: { first_name: "Bob", last_name: "Builder", avatar: null },
    department_name: "Design",
    position_name: "Designer",
    role: "Employee",
    cvs: [],
  };

  test.beforeEach(async ({ page, baseURL }) => {
    await setUserCookie(page, ADMIN_ID, baseURL!);
    await mockGraphQL(page, {
      GetEmployee: () => ({ user: MOCK_EMPLOYEE_DETAIL }),
      GetCurrentUserRole: () => ({ user: { role: "Admin" } }),
    });
    await page.goto(`/users/${EMPLOYEE_ID}`);
  });

  test("renders employee name, email and membership date", async ({
    page,
  }) => {
    await expect(page.getByText("Bob Builder")).toBeVisible();
    await expect(page.getByText("bob@example.com")).toBeVisible();
    await expect(page.getByText(/member since/i)).toBeVisible();
  });

  test("breadcrumb shows employee name with link back to employees list", async ({
    page,
  }) => {
    const employeesLink = page.getByRole("link", { name: /employees/i });
    await expect(employeesLink).toBeVisible();
    await expect(employeesLink).toHaveAttribute("href", "/users");
  });

  test("PROFILE tab is active by default", async ({ page }) => {
    const profileTab = page.getByRole("button", { name: /profile/i });
    await expect(profileTab).toHaveClass(/text-red-500/);
  });

  test("switching tabs renders SKILLS and LANGUAGES placeholders", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /skills/i }).click();
    await expect(page.getByText("TODO")).toBeVisible();

    await page.getByRole("button", { name: /languages/i }).click();
    await expect(page.getByText("TODO")).toBeVisible();
  });

  test("Admin can edit profile fields", async ({ page }) => {
    const firstNameInput = page.getByLabel("First Name");
    await expect(firstNameInput).toBeEnabled();
  });

  test("Update button is disabled when form is not dirty", async ({ page }) => {
    const updateBtn = page.getByRole("button", { name: /^update$/i });
    await expect(updateBtn).toBeDisabled();
  });

  test("Update button enables after editing a field", async ({ page }) => {
    await page.getByLabel("First Name").fill("Robert");
    await expect(page.getByRole("button", { name: /^update$/i })).toBeEnabled();
  });

  test("avatar upload button is visible for editable users", async ({
    page,
  }) => {
    await expect(
      page.getByText(/upload avatar image/i)
    ).toBeVisible();
  });

  test("file > 1MB shows an error message", async ({ page }) => {
    // Create a buffer larger than 1MB
    const bigFile = Buffer.alloc(1.1 * 1024 * 1024, "x");

    await page.locator('input[type="file"]').setInputFiles({
      name: "large.png",
      mimeType: "image/png",
      buffer: bigFile,
    });

    await expect(
      page.getByText(/no more than 1MB/i)
    ).toBeVisible();
  });

  test("read-only view for non-owner non-admin user", async ({
    page,
    baseURL,
  }) => {
    await setUserCookie(page, 999, baseURL!); // different employee
    await mockGraphQL(page, {
      GetEmployee: () => ({ user: MOCK_EMPLOYEE_DETAIL }),
      GetCurrentUserRole: () => ({ user: { role: "Employee" } }),
    });
    await page.goto(`/users/${EMPLOYEE_ID}`);

    await expect(page.getByLabel("First Name")).toBeDisabled();
    await expect(page.getByRole("button", { name: /^update$/i })).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// /users/me redirect
// ---------------------------------------------------------------------------

test.describe("/users/me redirect", () => {
  test("redirects to /users/[id] when user_id cookie is set", async ({
    page,
    baseURL,
  }) => {
    await setUserCookie(page, ADMIN_ID, baseURL!);
    await mockGraphQL(page, {
      GetEmployee: () => ({
        user: {
          id: String(ADMIN_ID),
          email: "admin@example.com",
          is_verified: true,
          created_at: null,
          profile: { first_name: "Alice", last_name: "Admin", avatar: null },
          department_name: "Engineering",
          position_name: "Lead",
          role: "Admin",
          cvs: [],
        },
      }),
      GetCurrentUserRole: () => ({ user: { role: "Admin" } }),
    });

    await page.goto("/users/me");
    await expect(page).toHaveURL(`/users/${ADMIN_ID}`);
  });

  test("redirects to /auth/login when user_id cookie is absent", async ({
    page,
  }) => {
    await page.goto("/users/me");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

// ---------------------------------------------------------------------------
// Sidebar layout
// ---------------------------------------------------------------------------

test.describe("Sidebar layout", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await setUserCookie(page, ADMIN_ID, baseURL!);
    await mockGraphQL(page, {
      GetEmployees: () => ({ users: MOCK_EMPLOYEES }),
      GetCurrentUserRole: () => ({ user: { role: "Admin" } }),
    });
    await page.goto("/users");
  });

  test("sidebar shows navigation items", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Employees")).toBeVisible();
    await expect(sidebar.getByText("Skills")).toBeVisible();
    await expect(sidebar.getByText("Languages")).toBeVisible();
    await expect(sidebar.getByText("CVs")).toBeVisible();
  });

  test("collapse button hides nav labels", async ({ page }) => {
    const sidebar = page.locator("aside");
    await sidebar.getByRole("button", { name: /свернуть/i }).click();

    await expect(sidebar.getByText("Employees")).not.toBeVisible();
    await expect(sidebar.getByText("Skills")).not.toBeVisible();
  });

  test("expanding sidebar reveals nav labels again", async ({ page }) => {
    const sidebar = page.locator("aside");
    await sidebar.getByRole("button", { name: /свернуть/i }).click();
    await sidebar.getByRole("button", { name: /развернуть/i }).click();

    await expect(sidebar.getByText("Employees")).toBeVisible();
  });

  test("current user avatar and name are visible in sidebar", async ({
    page,
  }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Alice Admin")).toBeVisible();
  });

  test("clicking user avatar navigates to /users/me", async ({ page }) => {
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /alice admin/i }).click();
    await expect(page).toHaveURL(/\/users\/(me|\d+)/);
  });

  test("Employees nav link is highlighted when on /users", async ({
    page,
  }) => {
    const link = page.locator("aside").getByRole("link", { name: /employees/i });
    await expect(link).toHaveClass(/bg-white\/10/);
  });
});
