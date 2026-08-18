// @ts-check
/**
 * Minimal .env loader for the E2E suite.
 *
 * Deliberately dependency-free: the frontend has no direct `dotenv` dependency
 * (it only gets one transitively via react-scripts), and we don't want the E2E
 * harness to break the day that transitive dep moves.
 *
 * Precedence: real process.env always wins, so CI secrets override the file.
 */
const fs = require("fs");
const path = require("path");

const ENV_FILE = path.resolve(__dirname, ".env.e2e");

function loadEnvFile() {
  if (!fs.existsSync(ENV_FILE)) return;

  const raw = fs.readFileSync(ENV_FILE, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    // strip a single layer of matching quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

/**
 * Reads a required env var, failing loudly with a fix-it message instead of
 * letting a test fail later with a confusing "expected /dashboard" timeout.
 * @param {string} name
 * @returns {string}
 */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required E2E env var ${name}.\n` +
        `Copy HRMS_Frontend/e2e/.env.e2e.example to HRMS_Frontend/e2e/.env.e2e and fill it in,\n` +
        `or export ${name} in your shell / CI secrets.`
    );
  }
  return value;
}

const config = {
  /** URL the CRA dev server is served from (frontend/.env sets PORT=3002). */
  baseURL: process.env.E2E_BASE_URL || "http://localhost:3002",
  /** Backend API root (frontend/.env sets REACT_APP_API_URL). */
  apiURL: process.env.E2E_API_URL || "http://localhost:3001/apis",
  get email() {
    return required("E2E_EMAIL");
  },
  get password() {
    return required("E2E_PASSWORD");
  },
};

module.exports = { config, required, ENV_FILE };
