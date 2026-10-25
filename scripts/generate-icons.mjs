#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '../public/icons')
mkdirSync(dir, { recursive: true })

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img">
  <rect width="512" height="512" rx="96" fill="#0f172a"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#c2410c" stroke-width="36"/>
  <circle cx="256" cy="256" r="110" fill="#1e3a5f"/>
  <text x="256" y="278" text-anchor="middle" font-family="system-ui,sans-serif" font-size="96" font-weight="700" fill="#f97316">S</text>
</svg>`

writeFileSync(join(dir, 'icon.svg'), svg)
writeFileSync(join(__dirname, '../public/favicon.svg'), svg)

// Minimal valid PNG so paths never 404 during install checks
const tiny = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)
for (const name of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
  writeFileSync(join(dir, name), tiny)
}
console.log('icons ready')
