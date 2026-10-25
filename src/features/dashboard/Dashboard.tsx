import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getTodayKey,
  getRecordsForDate,
  listSevaTypes,
} from '../../db/repositories/sevaRepository'
import type { SevaRecord, SevaType } from '../../db/schema'

export function Dashboard() {
  const [dateKey, setDateKey] = useState('')
  const [types, setTypes] = useState<SevaType[]>([])
  const [records, setRecords] = useState<SevaRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const today = await getTodayKey()
        const [t, r] = await Promise.all([
          listSevaTypes(true),
          getRecordsForDate(today),
        ])
        if (!cancelled) {
          setDateKey(today)
          setTypes(t)
          setRecords(r)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const completed = records.filter((r) => r.status === 'completed').length
  const total = types.length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-slate-100">Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">
          Today • {dateKey || '…'}
        </p>
      </section>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : (
        <>
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Nitya Seva progress</p>
                <p className="text-3xl font-semibold text-orange-300 mt-1">
                  {completed}
                  <span className="text-lg text-slate-400 font-normal">
                    {' '}
                    / {total}
                  </span>
                </p>
              </div>
              <p className="text-2xl font-medium text-slate-200">{pct}%</p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/seva"
              className="flex-1 text-center rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-4 transition"
            >
              Open Nitya Seva Register
            </Link>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Quick status
            </h3>
            <ul className="space-y-2">
              {types.map((t) => {
                const rec = records.find((r) => r.seva_type_id === t.id)
                const status = rec?.status ?? 'pending'
                const color =
                  status === 'completed'
                    ? 'text-green-400'
                    : status === 'skipped'
                      ? 'text-slate-500'
                      : status === 'partial'
                        ? 'text-yellow-400'
                        : 'text-slate-400'
                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-200">{t.name}</span>
                    <span className={`capitalize ${color}`}>{status}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
