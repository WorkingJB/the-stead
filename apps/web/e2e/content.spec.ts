import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("content read path", () => {
  test("programs index lists all six tiers", async ({ page }) => {
    await page.goto("/program");
    await expect(page.getByRole("heading", { name: "Programs", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /The Foundation/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /The Strength Hall/ })).toBeVisible();
  });

  test("program overview shows blocks and a week grid", async ({ page }) => {
    await page.goto("/program/tier-0");
    await expect(page.getByRole("heading", { name: "The Foundation", level: 1 })).toBeVisible();
    await expect(page.getByText("The Engine")).toBeVisible(); // block 1 name
    await expect(page.getByRole("link", { name: /Day 1/ }).first()).toBeVisible();
  });

  test("day view renders parsed prescriptions for both paths", async ({ page }) => {
    await page.goto("/program/tier-0/1/1");
    await expect(
      page.getByRole("heading", { name: /Strength A · Push \+ Squat/ }),
    ).toBeVisible();
    // Parsed from data/progressions/tier-0.yaml, Path B day 1.
    await expect(page.getByText("Standard pushup")).toBeVisible();
    await expect(page.getByText("Path A · On-ramp")).toBeVisible();
    await expect(page.getByText("Path B · Build")).toBeVisible();
    // The per-day coaching note.
    await expect(page.getByText(/Leave 2-3 reps in reserve/)).toBeVisible();
  });

  test("movement library links through to a movement card", async ({ page }) => {
    await page.goto("/movements/tier-0/pushup");
    await expect(page.getByRole("heading", { name: "Pushup", level: 1 })).toBeVisible();
    await expect(page.getByText(/Why it matters/i).first()).toBeVisible();
    await expect(page.getByText(/Common errors/i).first()).toBeVisible();
  });
});

test.describe("content accessibility (axe-core)", () => {
  for (const path of [
    "/program",
    "/program/tier-0",
    "/program/tier-0/1/1",
    "/movements",
    "/movements/tier-0/pushup",
  ]) {
    test(`no detectable a11y violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
