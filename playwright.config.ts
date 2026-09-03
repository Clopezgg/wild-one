import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: 1,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: process.env.CI ? "npm run start -- --hostname 127.0.0.1" : "npm run dev -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium-iphone", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    { name: "webkit-iphone", use: { ...devices["iPhone 13"], browserName: "webkit" } },
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
});
