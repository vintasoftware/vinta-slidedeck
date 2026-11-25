/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// Runs every Storybook story as a test in headless Chromium (renders without errors; a11y checks reported per
// `parameters.a11y.test` in .storybook/preview.tsx). Kept apart from vite.config.ts so
// the deck's dev server and build don't load test tooling.
// More info: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
