import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4179', browserName: 'chromium' },
  webServer: { command: 'npm run dev -- --port 4179', url: 'http://127.0.0.1:4179', reuseExistingServer: true },
})
