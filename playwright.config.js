// @ts-check
const { defineConfig, devices } = require("@playwright/test");
const { config: env } = require("./e2e/load-env");

const isCI = !!process.env.CI;

/**
 * Playwright config for the HRMS frontend.
 *
 * The app is a CRA dev server (PORT=3002 in .env) talking to the Express
 * backend on :3001. Both must be reachable; see e2e/README.md.
 *
 * Timeouts are deliberately generous: CRA compiles routes on first request,
 * BasePage lazy-loads every module, and Login.js wraps its submit in a
 * hard-coded 1s setTimeout.
 */
module.exports = defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.artifacts/test-results",

  timeout: 90_000,
  expect: { timeout: 15_000 },

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,

  // The CRA dev server is single-threaded and this bundle is large (~200 lazy
  // modules). Left at the default (one worker per core) it gets swamped and
  // every navigation times out waiting for `load`. Keep the cap low.
  workers: isCI ? 1 : 2,

  reporter: isCI
    ? [["github"], ["html", { outputFolder: "./e2e/.artifacts/report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "./e2e/.artifacts/report", open: "never" }]],

  use: {
    baseURL: env.baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Note: every project pins a desktop viewport — AuthPage hides the
  // right-hand panel below the `lg` breakpoint.
  projects: [
    // Signed-out specs. Deliberately NOT dependent on `setup`: if the backend
    // is down or credentials are wrong, these still run and still tell you
    // whether the login page renders.
    {
      name: "chromium-guest",
      testMatch: /tests[\\/]login\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: { cookies: [], origins: [] },
      },
    },

    // Signs in once via the real UI and persists localStorage (redux-persist
    // keeps the auth slice under "persist:v726-demo1-auth") for reuse.
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },

    // Everything that needs an established session.
    {
      name: "chromium",
      testMatch: /tests[\\/].*\.spec\.js/,
      testIgnore: /tests[\\/]login\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: "./e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  // Reuses the dev server you already have running; only starts one if the
  // port is free. CRA opens a browser tab on boot unless BROWSER=none.
  webServer: {
    command: "npm start",
    url: env.baseURL,
    reuseExistingServer: !isCI,
    timeout: 300_000,
    stdout: "ignore",
    stderr: "pipe",
    env: { BROWSER: "none" },
  },
});
