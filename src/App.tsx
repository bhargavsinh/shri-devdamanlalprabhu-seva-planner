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

const primaryNav = [
  { to: '/', label: 'Home', end: true, icon: '⌂' },
  { to: '/seva', label: 'Seva', icon: 'ॐ' },
  { to: '/calendar', label: 'Calendar', icon: '▦' },
  { to: '/files', label: 'Files', icon: '▤' },
  { to: '/more', label: 'More', icon: '⋯' },
]

const moreLinks = [
  { to: '/inventory', label: 'Inventory' },
  { to: '/reminders', label: 'Reminders' },
  { to: '/backup', label: 'Backup' },
  { to: '/settings', label: 'Settings' },
]

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col pt-safe">
      <header className="border-b border-slate-700/80 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
            S
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-orange-400 leading-tight">
              SDSP
            </h1>
            <p className="text-[10px] text-slate-400 truncate">
              Shri Devdaman Seva Planner
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 pb-nav">
        {children}
      </main>

      <nav className="bottom-nav fixed bottom-0 inset-x-0 z-20 border-t border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="max-w-3xl mx-auto flex">
          {primaryNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition ${
                  isActive
                    ? 'text-orange-300'
                    : 'text-slate-400 active:text-slate-200'
                }`
              }
            >
              <span className="text-lg leading-none" aria-hidden>
                {n.icon}
              </span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

function MorePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">More</h2>
      <ul className="space-y-2">
        {moreLinks.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              className="block rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-100 active:bg-slate-700"
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500 pt-4">
        Local-first · Private · Install from browser menu for home-screen app
      </p>
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
    <div className="min-h-full flex items-center justify-center p-4 pt-safe">
      <form
        onSubmit={submit}
        className="w-full max-w-xs space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
      >
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xl mb-3">
            S
          </div>
          <h1 className="text-orange-400 font-semibold">SDSP Locked</h1>
          <p className="text-xs text-slate-500 mt-1">Enter PIN to continue</p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-center text-lg tracking-widest"
          placeholder="••••"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value)
            setErr(false)
          }}
          autoFocus
        />
        {err && (
          <p className="text-xs text-red-400 text-center">Incorrect PIN</p>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-orange-600 active:bg-orange-500 py-3 font-medium"
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
      <div className="min-h-full flex items-center justify-center text-slate-400 pt-safe">
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
          <Route path="/more" element={<MorePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
