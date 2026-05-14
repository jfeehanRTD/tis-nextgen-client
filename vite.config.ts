import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'

// AGW + mTLS proxy mode.
// Default (TISNG_MTLS unset/false): /api proxies to the local backend at
// http://localhost:8082 — same shape as before, no friction for normal local dev.
// TISNG_MTLS=true: /api proxies to Application Gateway over HTTPS with the
// client certificate the AGW SSL profile requires. See
// docs/TestThinClient.md in tis-next-gen for the full certificate workflow.
const USE_MTLS = process.env.TISNG_MTLS === 'true'
const CERT_DIR =
  process.env.TISNG_CERT_DIR ?? path.resolve(__dirname, 'certs')
const AGW_HOST =
  process.env.TISNG_AGW_HOST ??
  'https://tisng-agw-test.westus3.cloudapp.azure.com'

function mtlsProxy() {
  // Refuse to silently fall back to plain HTTP if someone overrides
  // TISNG_AGW_HOST=http://... — the whole point of this mode is the TLS
  // handshake. Fail loud at startup instead.
  if (!AGW_HOST.startsWith('https://')) {
    throw new Error(
      `TISNG_MTLS=true requires TISNG_AGW_HOST to be https:// (got: ${AGW_HOST})`,
    )
  }

  // Preflight: missing files or world-readable keys are misconfig, not a
  // recoverable runtime error — surface them before Vite finishes booting
  // so the operator sees a clear message instead of a 502 on the first
  // request.
  const certPath = path.join(CERT_DIR, 'client.crt')
  const keyPath = path.join(CERT_DIR, 'client.key')
  const caPath = path.join(CERT_DIR, 'ca.crt')
  for (const p of [certPath, keyPath, caPath]) {
    if (!fs.existsSync(p)) {
      throw new Error(`TISNG_MTLS=true but cert file missing: ${p}`)
    }
  }
  // POSIX-only: 0o077 = group + other rwx. The private key must zero those
  // bits. Windows file permissions don't map cleanly to Unix mode bits, so
  // skip the check there (statSync.mode is fictional on win32 anyway).
  if (process.platform !== 'win32') {
    const keyMode = fs.statSync(keyPath).mode & 0o777
    if (keyMode & 0o077) {
      throw new Error(
        `client.key has permissions ${keyMode.toString(8)}; must be 600 or ` +
          `stricter (private key readable by group/other is a leak risk). ` +
          `Run: chmod 600 ${keyPath}`,
      )
    }
  }

  // Vite 8 ships http-proxy-3; cert/key/ca placed at the proxy-options top
  // level are NOT forwarded onto the outbound TLS connection (curl would pass
  // while the browser silently fails mTLS). Pass them via a custom https.Agent
  // so the client cert actually presents.
  // Pin TLS 1.3 minimum. AGW WAF_v2 supports 1.3; pinning here removes
  // the 1.2 fallback so a server-side misconfig (or future downgrade
  // attack against weak 1.2 ciphers) can't quietly negotiate something
  // weaker than what the design assumes.
  const agent = new https.Agent({
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
    ca: fs.readFileSync(caPath),
    minVersion: 'TLSv1.3',
  })
  return {
    target: AGW_HOST,
    changeOrigin: true,
    secure: true,
    agent,
  }
}

const localProxy = {
  target: 'http://localhost:8082',
  changeOrigin: true,
}

// Use the function form so `mtlsProxy()` (which reads cert files) is only
// invoked when actually starting the dev server. Otherwise `vite build`,
// `vitest`, etc. would fail with ENOENT for client.crt whenever TISNG_MTLS=true
// was exported in the shell — even though those commands have no dev-server
// proxy at all.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Bind to loopback only. mTLS protects the AGW hop, but the localhost:3000
    // dev server itself is plain HTTP. Binding to 0.0.0.0 (or running
    // `npm run dev -- --host`) would let anyone on the same network send
    // requests through this proxy carrying *your* client cert. Explicit
    // override is still possible but requires intent.
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api':
        command === 'serve' && USE_MTLS ? mtlsProxy() : localProxy,
    },
  },
}))
