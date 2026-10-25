import { useCallback, useEffect, useState } from 'react'
import {
  getTodayKey,
  getRecordsForDate,
  listSevaTypes,
  upsertSevaRecord,
  updateRecordStatus,
} from '../../db/repositories/sevaRepository'
import type { SevaRecord, SevaStatus, SevaType } from '../../db/schema'

const STATUSES: SevaStatus[] = ['pending', 'completed', 'partial', 'skipped']

export function SevaRegister() {
  const [dateKey, setDateKey] = useState('')
  const [types, setTypes] = useState<SevaType[]>([])
  const [records, setRecords] = useState<SevaRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({})

  const reload = useCallback(async (key: string) => {
    const [t, r] = await Promise.all([
      listSevaTypes(true),
      getRecordsForDate(key),
    ])
    setTypes(t)
    setRecords(r)
    const drafts: Record<number, string> = {}
    r.forEach((rec) => {
      if (rec.seva_type_id) drafts[rec.seva_type_id] = rec.notes
    })
    setNotesDraft(drafts)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      setLoading(true)
      try {
        const today = await getTodayKey()
        if (!cancelled) {
          setDateKey(today)
          await reload(today)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [reload])

  async function handleStatusChange(
    type: SevaType,
    status: SevaStatus
  ) {
    if (!type.id || !dateKey) return
    setSavingId(type.id)
    try {
      const existing = records.find((r) => r.seva_type_id === type.id)
      const notes = notesDraft[type.id] ?? existing?.notes ?? ''
      if (existing?.id) {
        await updateRecordStatus(existing.id, status, notes)
      } else {
        await upsertSevaRecord({
          date_key: dateKey,
          seva_type_id: type.id,
          status,
          notes,
        })
      }
      await reload(dateKey)
    } catch (e) {
      console.error(e)
      alert('Failed to save. Please try again.')
    } finally {
      setSavingId(null)
    }
  }

  async function handleNotesBlur(type: SevaType) {
    if (!type.id || !dateKey) return
    const existing = records.find((r) => r.seva_type_id === type.id)
    const notes = notesDraft[type.id] ?? ''
    if (!existing && !notes.trim()) return
    if (existing && existing.notes === notes) return

    setSavingId(type.id)
    try {
      await upsertSevaRecord({
        date_key: dateKey,
        seva_type_id: type.id,
        status: existing?.status ?? 'pending',
        notes,
      })
      await reload(dateKey)
    } catch (e) {
      console.error(e)
    } finally {
      setSavingId(null)
    }
  }

  function onDateChange(value: string) {
    setDateKey(value)
    setLoading(true)
    reload(value).finally(() => setLoading(false))
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Nitya Seva Register
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Local records only. Changes persist in this browser.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-400">Date</span>
          <input
            type="date"
            value={dateKey}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </label>
      </section>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {types.map((type) => {
            const rec = records.find((r) => r.seva_type_id === type.id)
            const status = rec?.status ?? 'pending'
            const isSaving = savingId === type.id
            return (
              <li
                key={type.id}
                className="rounded-xl border border-slate-700 bg-slate-800/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-slate-100">{type.name}</h3>
                    <p className="text-xs text-slate-500">{type.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleStatusChange(type, s)}
                        className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition disabled:opacity-50 ${
                          status === s
                            ? s === 'completed'
                              ? 'bg-green-600 text-white'
                              : s === 'skipped'
                                ? 'bg-slate-600 text-slate-200'
                                : s === 'partial'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-orange-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <textarea
                    rows={2}
                    placeholder="Notes (optional)"
                    value={notesDraft[type.id!] ?? ''}
                    onChange={(e) =>
                      setNotesDraft((prev) => ({
                        ...prev,
                        [type.id!]: e.target.value,
                      }))
                    }
                    onBlur={() => handleNotesBlur(type)}
                    className="w-full rounded-md border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-y"
                  />
                </div>
                {isSaving && (
                  <p className="mt-2 text-xs text-orange-300/80">Saving…</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
