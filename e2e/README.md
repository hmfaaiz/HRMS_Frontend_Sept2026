# HRMS Frontend — Playwright E2E

End-to-end tests that drive the real CRA app against the real Express backend.
No mocking: if these pass, a human can sign in.

## Prerequisites

1. **Backend running** on `http://localhost:3001`:
   ```
   cd ../HRMS_backend && npm run dev
   ```
2. **Credentials.** Copy the example env file and fill it in:
   ```
   cp e2e/.env.e2e.example e2e/.env.e2e
   ```
   Use a dedicated test account. `e2e/.env.e2e` is gitignored.

The frontend dev server does **not** need to be running — Playwright starts it
if `:3002` is free, and reuses yours if it isn't.

## Running

```
npm run test:e2e            # headless, all browsers/projects
npm run test:e2e:headed     # watch it happen
npm run test:e2e:ui         # Playwright UI mode — best for writing tests
npm run test:e2e:debug      # step through with the inspector
npm run test:e2e:report     # open the last HTML report
```

Target a single file or test:

```
npx playwright test e2e/tests/login.spec.js
npx playwright test -g "signs in with valid credentials"
```

## Layout

```
e2e/
  auth.setup.js        signs in once, saves storageState to e2e/.auth/user.json
  load-env.js          dependency-free .env.e2e loader + required-var checks
  pages/login.page.js  page object for the login form
  tests/
    login.spec.js      signed-out: validation, bad creds, successful sign-in
    dashboard.spec.js  signed-in: session restore, no 5xx, logout
  .artifacts/          reports, traces, screenshots (gitignored)
  .auth/               saved session (gitignored — it holds a real JWT)
```

The `setup` project runs first and writes `e2e/.auth/user.json`; the `chromium`
project loads it, so authenticated specs skip the login form. Specs that need a
signed-out browser opt out with:

```js
test.use({ storageState: { cookies: [], origins: [] } });
```

## Things worth knowing about this app

- **Post-login route.** `Routes.js` renders `BasePage` once `auth.user` is set;
  `BasePage` redirects `/` → `/dashboard`. Assert on `/dashboard`.
- **Session storage.** `redux-persist` keeps the auth slice in `localStorage`
  under `persist:v726-demo1-auth` (whitelist: `tokens`, `user`, `userAccess`,
  `menu`). That key is the source of truth for "am I logged in".
- **Routes are permission-gated.** `BasePage` only mounts routes present in
  `auth.userAccess`. A test that navigates to a module the test user can't see
  lands on `error/error-v1`, not a 404. Pick your test account accordingly.
- **Slow first paint.** CRA compiles on demand and `BasePage` lazy-loads ~200
  modules. `Login.js` also wraps its submit in a hard-coded 1s `setTimeout`.
  Hence the 90s test timeout and 60s navigation timeout.
- **Don't raise `workers`.** The CRA dev server is single-threaded. At the
  Playwright default (one worker per core) it gets swamped serving the dev
  bundle and *every* navigation times out waiting for `load` — a failure that
  looks like a broken app but isn't. Measured on this repo: 6 workers → 6/6
  timeouts; 2 workers → 6/6 pass in 22s. Run against a production build
  (`npm run build` + `serve`) if you need more parallelism.
- **Email input naming.** `Login.js` writes `name="emails"` but spreads
  `formik.getFieldProps("email")` after it, so the rendered name is `email`.
  The page object targets placeholders to sidestep the confusion.
- **OTP / 2FA.** Users with `authType === 2` get an OTP step. The backend
  currently returns the generated code in the login response body
  (`auth.controller.js` → `data: { isOTP: true, randomNum }`), and
  `login.page.js` reads it to complete the flow. **That echo is a real security
  bug** — the OTP should never leave the server. When it's fixed, this helper
  will fail loudly; that's intended. Prefer a test user with `authType !== 2`.

## CI

`CI=true` changes behaviour: 2 retries, 1 worker, `forbidOnly`, the GitHub
reporter, and Playwright starts its own dev server instead of reusing one.
Provide `E2E_EMAIL` / `E2E_PASSWORD` as secrets — real env vars take precedence
over `.env.e2e`.

Install browsers in CI with `npx playwright install --with-deps chromium`.

Note: this project's dependency tree has a pre-existing peer conflict (MUI 4
wants React 16, the app is on React 17), so `npm ci`/`npm install` needs
`--legacy-peer-deps`.
