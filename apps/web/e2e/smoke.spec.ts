import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("public pages render", () => {
  test("landing page shows the hero", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /a modern village in field clothes/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
  });

  test("about page renders authored content from Markdown", async ({ page }) => {
    await page.goto("/about");
    // Text that exists in content/tier-0/front-matter/01-welcome.md
    await expect(page.getByText(/four pillars/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /welcome to the stead/i })).toBeVisible();
  });

  test("login page shows the magic-link form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send magic link/i })).toBeVisible();
  });
});

test.describe("auth guard", () => {
  test("protected /today redirects anonymous users to /login", async ({ page }) => {
    await page.goto("/today");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("accessibility (axe-core)", () => {
  for (const path of ["/", "/about", "/login"]) {
    test(`no detectable a11y violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
