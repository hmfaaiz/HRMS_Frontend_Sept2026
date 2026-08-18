// @ts-check
const { test, expect } = require("@playwright/test");
const { config: env } = require("../load-env");
const { LoginPage } = require("../pages/login.page");

// Signed-out experience. The `chromium-guest` project already runs this file
// without a stored session; restated here so the file is correct even if it's
// run ad hoc under another project.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("login page", () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("renders the sign-in form", async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test("redirects an unauthenticated visitor to /auth/login", async ({ page }) => {
    // Routes.js falls through to <Redirect to="/auth/login" /> when auth.user is null.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.heading).toBeVisible();
  });

  test("shows validation errors when submitting an empty form", async () => {
    await loginPage.submitButton.click();
    await expect(loginPage.fieldErrors.first()).toBeVisible();
  });

  test("rejects a malformed email address", async () => {
    await loginPage.emailInput.fill("not-an-email");
    await loginPage.passwordInput.fill("whatever123");
    await loginPage.submitButton.click();
    await expect(loginPage.fieldErrors.filter({ hasText: "Wrong email format" })).toBeVisible();
  });

  test("surfaces the API error for bad credentials", async () => {
    await loginPage.emailInput.fill("nobody.e2e@invalid.local");
    await loginPage.passwordInput.fill("definitely-wrong");
    await loginPage.submitButton.click();

    // Login.js pipes error.response.data.message into formik.status → .alert-text.
    await expect(loginPage.formError).toBeVisible({ timeout: 30_000 });
    await expect(loginPage.formError).not.toBeEmpty();
    await expect(loginPage.page).toHaveURL(/\/auth\/login/);
  });

  test("signs in with valid credentials and lands on the dashboard", async ({ page }) => {
    await loginPage.login(env.email, env.password);
    await loginPage.expectLoggedIn();

    const persisted = await page.evaluate(() =>
      window.localStorage.getItem("persist:v726-demo1-auth")
    );
    expect(persisted).toContain("tokens");
  });

  test("navigates to forgot password", async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });
});
