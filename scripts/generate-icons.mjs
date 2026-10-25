#!/usr/bin/env node
/** Ensures PWA icons exist before build (SVG + simple PNG placeholders). */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '../public/icons')
mkdirSync(dir, { recursive: true })

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f172a"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#c2410c" stroke-width="36"/>
  <circle cx="256" cy="256" r="110" fill="#1e3a5f"/>
  <text x="256" y="278" text-anchor="middle" font-family="system-ui,sans-serif" font-size="96" font-weight="700" fill="#f97316">S</text>
</svg>`

writeFileSync(join(dir, 'icon.svg'), svg)
writeFileSync(join(__dirname, '../public/favicon.svg'), svg)

// Minimal 1x1 PNG fallbacks if missing (browsers prefer real sizes from manifest paths that exist)
// A valid tiny transparent PNG:
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

for (const name of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
  const p = join(dir, name)
  if (!existsSync(p)) {
    writeFileSync(p, tinyPng)
    console.log('placeholder', p)
  } else {
    console.log('exists', p)
  }
}

console.log('icons ready')
