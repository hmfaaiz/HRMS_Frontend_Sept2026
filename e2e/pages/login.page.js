// @ts-check
const { expect } = require("@playwright/test");

/**
 * Page object for src/app/modules/Auth/pages/Login.js.
 *
 * Selector notes:
 * - The email input is authored as `name="emails"` but `formik.getFieldProps("email")`
 *   is spread afterwards, so the rendered name is "email". Placeholders are used
 *   instead, since they're what a user actually sees and they survive that quirk.
 * - The submit button renders "Log In" and so does the <h1>, hence the role filter.
 */
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Log In" });
    this.emailInput = page.getByPlaceholder("Email", { exact: true });
    this.passwordInput = page.getByPlaceholder("Password", { exact: true });
    this.otpInput = page.getByPlaceholder("Enter Code");
    this.resendOtpButton = page.getByRole("button", { name: /Resend|\d+s/ });
    this.submitButton = page.getByRole("button", { name: "Log In" });
    this.forgotPasswordLink = page.getByRole("link", { name: "Forgot Password?" });
    // formik.status is rendered into .alert-text; field errors into .fv-help-block.
    this.formError = page.locator(".alert-text");
    this.fieldErrors = page.locator(".fv-help-block");
  }

  async goto() {
    await this.page.goto("/auth/login");
    await expect(this.heading).toBeVisible();
  }

  /**
   * Fills credentials and submits, transparently answering the OTP challenge
   * for users with authType === 2.
   *
   * The backend echoes the generated OTP back in the login response
   * (auth.controller.js returns `{ isOTP: true, randomNum }`), so the suite can
   * complete 2FA without an inbox. If that leak is ever fixed — it should be —
   * this helper starts failing, which is the correct signal. Prefer a test user
   * with authType !== 2 so the suite doesn't depend on it.
   *
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const loginResponse = this.page.waitForResponse(
      (res) => res.url().includes("/auth/login") && res.request().method() === "POST"
    );

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    const body = await (await loginResponse).json().catch(() => null);
    const otp = body?.data?.isOTP ? body?.data?.randomNum : null;

    if (otp) {
      await expect(this.otpInput).toBeVisible();
      await this.otpInput.fill(String(otp));
      await this.submitButton.click();
    } else if (body?.data?.isOTP) {
      throw new Error(
        "Login requires an OTP but the API response did not include one. " +
          "Use an E2E_EMAIL whose user has authType !== 2, or supply the OTP another way."
      );
    }
  }

  /** Waits for the post-login redirect. Routes.js sends "/" to "/dashboard". */
  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 60_000 });
  }
}

module.exports = { LoginPage };
