import { test, expect } from "@playwright/test";
import type { Employee } from "../app/users/page";

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, firstName: "Rostislav", lastName: "Harlanov", email: "thorn_pear@icloud.com", department: "React", position: "Software Engineer", avatar: null, initials: "RH" },
  { id: 2, firstName: "Vanf", lastName: "Darkholme", email: "tomgar9@outlook.com", department: ".NET", position: "Network Engineer", avatar: null, initials: "VD" },
  { id: 3, firstName: "Christoper", lastName: "Nolan", email: "christophernolan@gmail.com", department: "Blockchain", position: "DevOps Engineer", avatar: null, initials: "CN" },
  { id: 4, firstName: "", lastName: "", email: "vovavipse@gmail.com", department: "Blockchain", position: "", avatar: null, initials: "V" },
  { id: 5, firstName: "Марина", lastName: "", email: "persempre1+1@yandex.ru", department: "DevOps", position: "Data Analyst", avatar: null, initials: "М" },
  { id: 6, firstName: "Maksimodvj", lastName: "Hancharouiy", email: "maxim.goncharov@gmail.com", department: "Global", position: "Data Analyst", avatar: null, initials: "MH" },
  { id: 7, firstName: "Artem", lastName: "Lopatin", email: "artsem.lapatsin@innowise.com", department: "Global", position: "Project Manager", avatar: null, initials: "AL" },
  { id: 8, firstName: "sdsdsdsdsdsdsdvdf", lastName: "", email: "ferdik@mail.ru", department: "Java", position: "Data Analyst", avatar: null, initials: "SD" },
  { id: 9, firstName: "Artem", lastName: "Zhiznevskiy", email: "zhiznevskiy@gmail.com", department: "Java", position: "Data Analyst", avatar: null, initials: "AZ" },
  { id: 10, firstName: "Eva", lastName: "", email: "test123456789@gmail.com", department: "Mobile", position: "Software Engineer", avatar: null, initials: "E" },
];

test.describe("Users page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/users");
  });

  test.describe("layout", () => {
    test("renders sidebar navigation", async ({ page }) => {
      const nav = page.getByRole("navigation");
      await expect(nav.getByRole("link", { name: "Employees" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Skills" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Languages" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "CVs" })).toBeVisible();
    });

    test("highlights Employees as active nav item", async ({ page }) => {
      const link = page.getByRole("navigation").getByRole("link", { name: "Employees" });
      await expect(link).toHaveClass(/bg-white\/10/);
    });

    test("renders search input", async ({ page }) => {
      await expect(page.getByPlaceholder("Search")).toBeVisible();
    });

    test("renders table headers", async ({ page }) => {
      await expect(page.getByRole("columnheader", { name: /first name/i })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: /last name/i })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: /email/i })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: /department/i })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: /position/i })).toBeVisible();
    });

    test("renders 10 employee rows", async ({ page }) => {
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(MOCK_EMPLOYEES.length);
    });

    test("renders current user in sidebar", async ({ page }) => {
      const { firstName, lastName } = MOCK_EMPLOYEES[0];
      await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
    });
  });

  test.describe("search", () => {
    test("filters rows by first name", async ({ page }) => {
      const emp = MOCK_EMPLOYEES[0];
      await page.getByPlaceholder("Search").fill(emp.firstName);
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(1);
      await expect(page.getByRole("cell", { name: emp.firstName, exact: true })).toBeVisible();
    });

    test("filters rows by last name", async ({ page }) => {
      const emp = MOCK_EMPLOYEES[2];
      await page.getByPlaceholder("Search").fill(emp.lastName);
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(1);
      await expect(page.getByRole("cell", { name: emp.lastName, exact: true })).toBeVisible();
    });

    test("filters rows by email", async ({ page }) => {
      const emp = MOCK_EMPLOYEES[0];
      await page.getByPlaceholder("Search").fill(emp.email);
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(1);
    });

    test("filters rows by department", async ({ page }) => {
      const dept = "Blockchain";
      const count = MOCK_EMPLOYEES.filter((e) => e.department === dept).length;
      await page.getByPlaceholder("Search").fill(dept);
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(count);
    });

    test("filters rows by position", async ({ page }) => {
      const position = "Project Manager";
      const count = MOCK_EMPLOYEES.filter((e) => e.position === position).length;
      await page.getByPlaceholder("Search").fill(position);
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(count);
    });

    test("is case-insensitive", async ({ page }) => {
      const dept = "Blockchain";
      const count = MOCK_EMPLOYEES.filter((e) => e.department === dept).length;
      await page.getByPlaceholder("Search").fill(dept.toUpperCase());
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(count);
    });

    test("shows empty state when no results match", async ({ page }) => {
      await page.getByPlaceholder("Search").fill("zzznomatch");
      await expect(page.getByText("No employees found")).toBeVisible();
    });

    test("restores all rows after clearing search", async ({ page }) => {
      const input = page.getByPlaceholder("Search");
      await input.fill(MOCK_EMPLOYEES[0].firstName);
      await input.clear();
      const rows = page.getByRole("row").filter({ hasNotText: /first name/i });
      await expect(rows).toHaveCount(MOCK_EMPLOYEES.length);
    });
  });

  test.describe("sorting", () => {
    test("sorts departments ascending by default", async ({ page }) => {
      const cells = page.getByRole("cell").filter({
        hasText: /^(React|\.NET|Blockchain|DevOps|Global|Java|Mobile)$/,
      });
      const texts = await cells.allTextContents();
      expect(texts).toEqual([...texts].sort((a, b) => a.localeCompare(b)));
    });

    test("toggles to descending on Department header click", async ({ page }) => {
      await page.getByRole("columnheader", { name: /department/i }).click();
      const cells = page.getByRole("cell").filter({
        hasText: /^(React|\.NET|Blockchain|DevOps|Global|Java|Mobile)$/,
      });
      const texts = await cells.allTextContents();
      expect(texts).toEqual([...texts].sort((a, b) => b.localeCompare(a)));
    });

    test("toggles back to ascending on second click", async ({ page }) => {
      const header = page.getByRole("columnheader", { name: /department/i });
      await header.click();
      await header.click();
      const cells = page.getByRole("cell").filter({
        hasText: /^(React|\.NET|Blockchain|DevOps|Global|Java|Mobile)$/,
      });
      const texts = await cells.allTextContents();
      expect(texts).toEqual([...texts].sort((a, b) => a.localeCompare(b)));
    });
  });

  test.describe("row actions", () => {
    test("shows action buttons on row hover", async ({ page }) => {
      const firstRow = page.getByRole("row").filter({ hasNotText: /first name/i }).first();
      await firstRow.hover();
      await expect(firstRow.getByRole("button").first()).toBeVisible();
    });

    test("opens dropdown menu on MoreVertical click", async ({ page }) => {
      const firstRow = page.getByRole("row").filter({ hasNotText: /first name/i }).first();
      await firstRow.hover();
      await firstRow.getByRole("button").first().click();
      await expect(page.getByRole("menuitem", { name: "View profile" })).toBeVisible();
      await expect(page.getByRole("menuitem", { name: "Edit" })).toBeVisible();
      await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
    });
  });

  test.describe("navigation", () => {
    test("Skills link points to /skills", async ({ page }) => {
      const link = page.getByRole("navigation").getByRole("link", { name: "Skills" });
      await expect(link).toHaveAttribute("href", "/skills");
    });

    test("Languages link points to /languages", async ({ page }) => {
      const link = page.getByRole("navigation").getByRole("link", { name: "Languages" });
      await expect(link).toHaveAttribute("href", "/languages");
    });

    test("CVs link points to /cvs", async ({ page }) => {
      const link = page.getByRole("navigation").getByRole("link", { name: "CVs" });
      await expect(link).toHaveAttribute("href", "/cvs");
    });
  });
});
