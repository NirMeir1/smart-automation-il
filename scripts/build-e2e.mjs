// Reproducible browser-test build, including when private .env.local exists.
// Explicit process variables take precedence over Next.js dotenv loading.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { browserTestEnvironment } from './browser-test-env.mjs';

const result = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)), 'build'], {
  stdio: 'inherit', windowsHide: true,
  env: { ...process.env, ...browserTestEnvironment },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
