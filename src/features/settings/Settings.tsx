import { useEffect, useState } from 'react'
import {
  isLockEnabled,
  setLockPin,
  clearLock,
} from '../../db/repositories/settingsRepository'

export function SettingsPage() {
  const [enabled, setEnabled] = useState(false)
  const [pin, setPin] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    isLockEnabled().then(setEnabled)
  }, [])

  async function enableLock(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length < 4) {
      setMsg('PIN must be at least 4 characters')
      return
    }
    await setLockPin(pin)
    setPin('')
    setEnabled(true)
    setMsg('Local lock enabled. This is a simple PIN gate, not strong encryption.')
  }

  async function disableLock() {
    if (!confirm('Remove local lock?')) return
    await clearLock()
    setEnabled(false)
    setMsg('Lock removed')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings & Privacy</h2>

      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 space-y-3 text-sm">
        <p>
          Local lock status:{' '}
          <strong className={enabled ? 'text-green-400' : 'text-slate-400'}>
            {enabled ? 'Enabled' : 'Disabled'}
          </strong>
        </p>
        <p className="text-slate-400 text-xs">
          A lock screen only hides the UI. Data remains in browser storage and is not
          encrypted. Treat device access as part of the threat model.
        </p>

        {!enabled ? (
          <form onSubmit={enableLock} className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
              placeholder="Set PIN (min 4)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              minLength={4}
              required
            />
            <button
              type="submit"
              className="rounded bg-orange-600 hover:bg-orange-500 px-4 py-2 font-medium"
            >
              Enable lock
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={disableLock}
            className="rounded bg-slate-700 hover:bg-slate-600 px-4 py-2"
          >
            Disable lock
          </button>
        )}

        {msg && <p className="text-orange-300/90 text-xs">{msg}</p>}
      </div>
    </div>
  )
}
