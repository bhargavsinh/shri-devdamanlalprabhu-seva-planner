import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { seedDefaultSevaTypes } from './db/repositories/sevaRepository'
import { Dashboard } from './features/dashboard/Dashboard'
import { SevaRegister } from './features/seva-register/SevaRegister'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-orange-400">
              SDSP
            </h1>
            <p className="text-xs text-slate-400">Shri Devdaman Seva Planner</p>
          </div>
          <nav className="flex gap-1 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition ${
                  isActive
                    ? 'bg-orange-600/20 text-orange-300'
                    : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/seva"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition ${
                  isActive
                    ? 'bg-orange-600/20 text-orange-300'
                    : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Nitya Seva
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">{children}</main>
      <footer className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        Local-first • Private • V1 Foundation
      </footer>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    seedDefaultSevaTypes()
      .then(() => setReady(true))
      .catch((e) => {
        console.error(e)
        setError(e instanceof Error ? e.message : 'Database init failed')
        setReady(true)
      })
  }, [])

  if (!ready) {
    return (
      <div className="min-h-full flex items-center justify-center text-slate-400">
        Loading SDSP…
      </div>
    )
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
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
