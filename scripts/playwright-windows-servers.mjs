import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { browserTestServers } from './browser-test-env.mjs';

// Playwright uses a shell plus taskkill /T on Windows. Own the Next child handles
// directly instead, so cleanup needs neither process-tree enumeration nor taskkill.
export default async function setup() {
  const children = [];
  async function cleanup() {
    await Promise.all(children.map(async child => {
      if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
      const closed = once(child, 'close', { signal: AbortSignal.timeout(5000) });
      child.kill();
      await closed;
    }));
  }
  try {
    for (const { port, env } of browserTestServers) {
      // Preserve reuseExistingServer:false; never attach to or stop someone else's server.
      const probe = createServer();
      await new Promise((resolve, reject) => {
        probe.once('error', reject);
        probe.listen(port, '127.0.0.1', () => probe.close(resolve));
      });
      const child = spawn(process.execPath, [
        fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)),
        'start', '--hostname', '127.0.0.1', '--port', String(port),
      ], { env: { ...process.env, ...env }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
      children.push(child);
      let output = '', spawnError;
      child.on('error', error => { spawnError = error; });
      for (const stream of [child.stdout, child.stderr]) {
        stream.on('data', data => { output = (output + data).slice(-4000); });
      }
      const deadline = Date.now() + 30_000;
      while (true) {
        if (spawnError) throw spawnError;
        if (child.exitCode !== null) throw new Error(`Test server ${port} exited: ${output}`);
        try {
          const response = await fetch(`http://127.0.0.1:${port}`, { signal: AbortSignal.timeout(1000) });
          await response.body?.cancel();
          if (response.ok) break;
        } catch { /* Server is starting. */ }
        if (Date.now() >= deadline) throw new Error(`Test server ${port} did not start: ${output}`);
        await delay(100);
      }
    }
    return cleanup;
  } catch (error) {
    await cleanup();
    throw error;
  }
}
