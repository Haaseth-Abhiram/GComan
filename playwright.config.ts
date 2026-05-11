import { defineConfig, devices } from '@playwright/test';

// Two run modes:
// - default (fast): vite dev server. Tests client-side behavior, routing,
//   loading states, and React component output. Skips prerender plugin so
//   each test starts in <2s.
// - PROD_BUILD=1: build:dev + vite preview. Same JS bundle as production
//   minus the puppeteer prerender step (which adds ~10min for 300 URLs).
// - BASE_URL=https://…: run the same suite against a remote target (staging
//   or production) without rebuilding anything locally.

// Default to a non-standard port — 8080 is the vite dev default for this
// project and is commonly already in use locally. Using 4179 keeps the
// Playwright run isolated from manual dev sessions.
const PORT = Number(process.env.PORT ?? 4179);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const useProdBuild = process.env.PROD_BUILD === '1';
const isRemote = /^https?:\/\//.test(BASE_URL) && !BASE_URL.includes('localhost');

const devCommand = useProdBuild
  ? `npm run build:dev && npx vite preview --port ${PORT} --strictPort`
  : `npx vite --port ${PORT} --strictPort`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30 * 1000,
  expect: { timeout: 10 * 1000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: isRemote
    ? undefined
    : {
        command: devCommand,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: useProdBuild ? 5 * 60 * 1000 : 60 * 1000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
