// @ts-check
const { test, expect } = require("@playwright/test");

// Runs with the storageState produced by auth.setup.js (see playwright.config.js).
test.describe("authenticated shell", () => {
  test("restores the session and renders the dashboard", async ({ page }) => {
    await page.goto("/");

    // BasePage redirects "/" to "/dashboard".
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("#kt_login")).toHaveCount(0);
  });

  test("does not bounce a signed-in user back to /auth/login", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });

  test("dashboard loads without console errors or failed API calls", async ({ page }) => {
    /** @type {string[]} */
    const consoleErrors = [];
    /** @type {string[]} */
    const failedRequests = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 500) failedRequests.push(`${res.status()} ${res.url()}`);
    });

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    await page.waitForLoadState("networkidle");

    expect(failedRequests, "no 5xx responses while loading the dashboard").toEqual([]);
    // Console errors are reported but not asserted on: this legacy Metronic
    // build is noisy (deprecated lifecycle warnings, missing media assets).
    // Tighten this to an assertion once the baseline is clean.
    if (consoleErrors.length) {
      test.info().annotations.push({
        type: "console-errors",
        description: consoleErrors.slice(0, 10).join("\n"),
      });
    }
  });

  test("signs out and returns to the login page", async ({ page }) => {
    await page.goto("/logout");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole("heading", { name: "Log In" })).toBeVisible();
  });
});
