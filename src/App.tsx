import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { seedDefaultSevaTypes } from './db/repositories/sevaRepository'
import {
  isLockEnabled,
  verifyLockPin,
} from './db/repositories/settingsRepository'
import { Dashboard } from './features/dashboard/Dashboard'
import { SevaRegister } from './features/seva-register/SevaRegister'
import { CalendarPage } from './features/calendar/Calendar'
import { FileLibrary } from './features/file-library/FileLibrary'
import { Inventory } from './features/inventory/Inventory'
import { BackupPage } from './features/backup/BackupPage'
import { RemindersPage } from './features/reminders/Reminders'
import { SettingsPage } from './features/settings/Settings'

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/seva', label: 'Seva' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/files', label: 'Files' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/reminders', label: 'Reminders' },
  { to: '/backup', label: 'Backup' },
  { to: '/settings', label: 'Settings' },
]

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-slate-700 bg-slate-900/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h1 className="text-base font-semibold text-orange-400">SDSP</h1>
              <p className="text-[10px] text-slate-400">Shri Devdaman Seva Planner</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1 text-xs">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `px-2 py-1 rounded transition ${
                    isActive
                      ? 'bg-orange-600/25 text-orange-300'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5">{children}</main>
      <footer className="border-t border-slate-800 py-2 text-center text-[10px] text-slate-500">
        Local-first • Private • V1
      </footer>
    </div>
  )
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await verifyLockPin(pin)
    if (ok) onUnlock()
    else {
      setErr(true)
      setPin('')
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xs space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6"
      >
        <h1 className="text-center text-orange-400 font-semibold">SDSP Locked</h1>
        <input
          type="password"
          className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-center"
          placeholder="PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value)
            setErr(false)
          }}
          autoFocus
        />
        {err && <p className="text-xs text-red-400 text-center">Incorrect PIN</p>}
        <button
          type="submit"
          className="w-full rounded bg-orange-600 hover:bg-orange-500 py-2 font-medium"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [needsLock, setNeedsLock] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([seedDefaultSevaTypes(), isLockEnabled()])
      .then(([, lockOn]) => {
        setNeedsLock(lockOn)
        if (!lockOn) setUnlocked(true)
        setReady(true)
      })
      .catch((e) => {
        console.error(e)
        setError(e instanceof Error ? e.message : 'Init failed')
        setReady(true)
        setUnlocked(true)
      })
  }, [])

  if (!ready) {
    return (
      <div className="min-h-full flex items-center justify-center text-slate-400">
        Loading SDSP…
      </div>
    )
  }

  if (needsLock && !unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />
  }

  return (
    <BrowserRouter basename="/shri-devdamanlalprabhu-seva-planner">
      <Layout>
        {error && (
          <div className="mb-4 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/seva" element={<SevaRegister />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/files" element={<FileLibrary />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
