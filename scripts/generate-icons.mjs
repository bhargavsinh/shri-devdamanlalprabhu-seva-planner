#!/usr/bin/env node
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '../public/icons')
mkdirSync(dir, { recursive: true })

const names = ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png']
for (const name of names) {
  const b64path = join(dir, name + '.b64')
  const out = join(dir, name)
  if (existsSync(b64path)) {
    writeFileSync(out, Buffer.from(readFileSync(b64path, 'utf8').trim(), 'base64'))
    console.log('wrote from b64', name)
  } else {
    console.warn('missing', b64path)
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#0f172a"/><circle cx="256" cy="256" r="180" fill="none" stroke="#c2410c" stroke-width="36"/><circle cx="256" cy="256" r="110" fill="#1e3a5f"/><text x="256" y="278" text-anchor="middle" font-family="system-ui,sans-serif" font-size="96" font-weight="700" fill="#f97316">S</text></svg>`
writeFileSync(join(dir, 'icon.svg'), svg)
writeFileSync(join(__dirname, '../public/favicon.svg'), svg)
console.log('android icons ready')
