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
  // Vite 8 ships http-proxy-3; cert/key/ca placed at the proxy-options top
  // level are NOT forwarded onto the outbound TLS connection (curl would pass
  // while the browser silently fails mTLS). Pass them via a custom https.Agent
  // so the client cert actually presents.
  const agent = new https.Agent({
    cert: fs.readFileSync(path.join(CERT_DIR, 'client.crt')),
    key: fs.readFileSync(path.join(CERT_DIR, 'client.key')),
    ca: fs.readFileSync(path.join(CERT_DIR, 'ca.crt')),
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

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': USE_MTLS ? mtlsProxy() : localProxy,
    },
  },
})
