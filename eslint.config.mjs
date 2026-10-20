import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin.configs['core-web-vitals'],
  reactHooks.configs.flat.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  globalIgnores(['.next/**', '.tools/**', '.npm-cache/**', 'test-results/**', 'playwright-report/**', 'blob-report/**', 'coverage/**', 'next-env.d.ts']),
])
