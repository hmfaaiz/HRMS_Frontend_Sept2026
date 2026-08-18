// @ts-check
const path = require("path");
const { test: setup, expect, request } = require("@playwright/test");
const { config: env } = require("./load-env");
const { LoginPage } = require("./pages/login.page");

const STORAGE_STATE = path.resolve(__dirname, ".auth/user.json");

setup("backend is reachable", async () => {
  // Fail fast with a clear message rather than letting every test time out
  // waiting for a /dashboard redirect that can never happen.
  const api = await request.newContext();
  let reachable = false;
  try {
    const res = await api.post(`${env.apiURL}/auth/login`, {
      data: { email: "e2e-probe@invalid.local", password: "not-a-real-password" },
      timeout: 15_000,
    });
    // Any HTTP answer means the API is up; we expect a 4xx here.
    reachable = res.status() > 0;
  } catch (err) {
    throw new Error(
      `Cannot reach the HRMS backend at ${env.apiURL}.\n` +
        `Start it with: cd ../HRMS_backend && npm run dev\n` +
        `Original error: ${err instanceof Error ? err.message : String(err)}`
    );
  } finally {
    await api.dispose();
  }
  expect(reachable).toBe(true);
});

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.email, env.password);

  // Surface the API's own error text instead of a bare redirect timeout.
  if (await loginPage.formError.isVisible().catch(() => false)) {
    throw new Error(`Login rejected: ${await loginPage.formError.innerText()}`);
  }

  await loginPage.expectLoggedIn();

  // redux-persist writes the auth slice to localStorage under this key
  // (authRedux.js: key "v726-demo1-auth", whitelist tokens/user/userAccess/menu).
  const persisted = await page.evaluate(() =>
    window.localStorage.getItem("persist:v726-demo1-auth")
  );
  expect(persisted, "auth slice should be persisted to localStorage").toBeTruthy();
  expect(persisted).toContain("tokens");

  await page.context().storageState({ path: STORAGE_STATE });
});

module.exports = { STORAGE_STATE };
