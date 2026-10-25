import { db } from '../schema'

export async function getSetting(key: string): Promise<string | null> {
  const row = await db.settings.where('key').equals(key).first()
  return row?.value ?? null
}

export async function setSetting(key: string, value: string): Promise<void> {
  const existing = await db.settings.where('key').equals(key).first()
  if (existing?.id) {
    await db.settings.update(existing.id, { value })
  } else {
    await db.settings.add({ key, value })
  }
}

/** Simple local lock: stores a hashed PIN. Not strong encryption. */
export async function isLockEnabled(): Promise<boolean> {
  const pin = await getSetting('lock_pin_hash')
  return !!pin
}

export async function setLockPin(pin: string): Promise<void> {
  const hash = await hashPin(pin)
  await setSetting('lock_pin_hash', hash)
}

export async function verifyLockPin(pin: string): Promise<boolean> {
  const stored = await getSetting('lock_pin_hash')
  if (!stored) return true
  const hash = await hashPin(pin)
  return hash === stored
}

export async function clearLock(): Promise<void> {
  const row = await db.settings.where('key').equals('lock_pin_hash').first()
  if (row?.id) await db.settings.delete(row.id)
}

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode('sdsp-lock:' + pin)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
