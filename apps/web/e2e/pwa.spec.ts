import { test, expect } from "@playwright/test";

test.describe("PWA shell", () => {
  test("serves a valid web app manifest", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const manifest = await res.json();
    expect(manifest.name).toMatch(/The Stead/);
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  test("serves the compiled service worker at root scope", async ({ request }) => {
    const res = await request.get("/serwist/sw.js");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("javascript");
    // Broadened scope so a SW under /serwist/ can control the whole app.
    expect(res.headers()["service-worker-allowed"]).toBe("/");
  });

  test("home links the manifest and registers a service worker", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      /manifest\.webmanifest/,
    );
    // SerwistProvider registers client-side (production build only).
    await page.waitForFunction(
      () => navigator.serviceWorker?.controller != null ||
        navigator.serviceWorker?.getRegistration().then((r) => !!r),
      undefined,
      { timeout: 15_000 },
    );
    const hasRegistration = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    });
    expect(hasRegistration).toBe(true);
  });

  test("offline fallback page renders", async ({ page }) => {
    await page.goto("/~offline");
    await expect(
      page.getByRole("heading", { name: /no connection/i }),
    ).toBeVisible();
  });
});
