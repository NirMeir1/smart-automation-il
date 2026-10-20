import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    include: ['src/test/**/*.test.{ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      'server-only': resolve(import.meta.dirname, './src/test/server-only.ts'),
      '@': resolve(import.meta.dirname, './src'),
    },
  },
})
