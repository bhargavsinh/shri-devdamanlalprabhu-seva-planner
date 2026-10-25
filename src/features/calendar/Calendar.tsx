import { useEffect, useState } from 'react'
import {
  listEventsInRange,
  createEvent,
  deleteEvent,
  getPanchang,
  upsertPanchang,
} from '../../db/repositories/calendarRepository'
import type { CalendarEvent, EventType } from '../../db/schema'

function monthRange(year: number, month: number) {
  const from = `${year}-${String(month).padStart(2, '0')}-01`
  const last = new Date(year, month, 0).getDate()
  const to = `${year}-${String(month).padStart(2, '0')}-${String(last).padStart(2, '0')}`
  return { from, to }
}

export function CalendarPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selected, setSelected] = useState<string>('')
  const [panchang, setPanchang] = useState({
    vikram_samvat: '',
    month_name: '',
    paksha: '',
    tithi: '',
    source: '',
    verified: false,
  })
  const [form, setForm] = useState({
    title: '',
    event_type: 'utsav' as EventType,
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { from, to } = monthRange(year, month)
    listEventsInRange(from, to).then(setEvents)
  }, [year, month])

  useEffect(() => {
    if (!selected) return
    getPanchang(selected).then((p) => {
      if (p) {
        setPanchang({
          vikram_samvat: p.vikram_samvat,
          month_name: p.month_name,
          paksha: p.paksha,
          tithi: p.tithi,
          source: p.source,
          verified: !!p.verified_at,
        })
      } else {
        setPanchang({
          vikram_samvat: '',
          month_name: '',
          paksha: '',
          tithi: '',
          source: '',
          verified: false,
        })
      }
    })
  }, [selected])

  async function addEvent() {
    if (!selected || !form.title.trim()) return
    setLoading(true)
    try {
      await createEvent({
        title: form.title.trim(),
        start_date: selected,
        end_date: selected,
        event_type: form.event_type,
        reminder_at: null,
        notes: form.notes,
      })
      setForm({ title: '', event_type: 'utsav', notes: '' })
      const { from, to } = monthRange(year, month)
      setEvents(await listEventsInRange(from, to))
    } finally {
      setLoading(false)
    }
  }

  async function savePanchang() {
    if (!selected) return
    setLoading(true)
    try {
      await upsertPanchang({
        gregorian_date: selected,
        vikram_samvat: panchang.vikram_samvat,
        month_name: panchang.month_name,
        paksha: panchang.paksha,
        tithi: panchang.tithi,
        source: panchang.source || 'manual',
        verified_at: panchang.verified ? new Date().toISOString() : null,
      })
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">Calendar & Panchang</h2>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="px-2 py-1 rounded bg-slate-700 text-sm"
            onClick={() => {
              if (month === 1) {
                setMonth(12)
                setYear((y) => y - 1)
              } else setMonth((m) => m - 1)
            }}
          >
            ←
          </button>
          <span className="text-sm text-slate-300">
            {year}-{String(month).padStart(2, '0')}
          </span>
          <button
            type="button"
            className="px-2 py-1 rounded bg-slate-700 text-sm"
            onClick={() => {
              if (month === 12) {
                setMonth(1)
                setYear((y) => y + 1)
              } else setMonth((m) => m + 1)
            }}
          >
            →
          </button>
        </div>
      </section>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((d) => {
          const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const hasEvent = events.some((e) => e.start_date === key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`aspect-square rounded border text-sm ${
                selected === key
                  ? 'border-orange-500 bg-orange-600/30'
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700'
              }`}
            >
              <span className="block">{d}</span>
              {hasEvent && <span className="block text-[9px] text-orange-300">•</span>}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm">
          <h3 className="font-medium text-slate-200">Selected: {selected}</h3>

          <div className="grid sm:grid-cols-2 gap-2">
            <input
              className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              placeholder="Vikram Samvat"
              value={panchang.vikram_samvat}
              onChange={(e) => setPanchang((p) => ({ ...p, vikram_samvat: e.target.value }))}
            />
            <input
              className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              placeholder="Month name"
              value={panchang.month_name}
              onChange={(e) => setPanchang((p) => ({ ...p, month_name: e.target.value }))}
            />
            <input
              className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              placeholder="Paksha"
              value={panchang.paksha}
              onChange={(e) => setPanchang((p) => ({ ...p, paksha: e.target.value }))}
            />
            <input
              className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              placeholder="Tithi"
              value={panchang.tithi}
              onChange={(e) => setPanchang((p) => ({ ...p, tithi: e.target.value }))}
            />
            <input
              className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5 sm:col-span-2"
              placeholder="Source"
              value={panchang.source}
              onChange={(e) => setPanchang((p) => ({ ...p, source: e.target.value }))}
            />
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={panchang.verified}
                onChange={(e) => setPanchang((p) => ({ ...p, verified: e.target.checked }))}
              />
              Mark as verified
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={savePanchang}
              className="sm:col-span-2 rounded bg-slate-600 hover:bg-slate-500 py-1.5"
            >
              Save Panchang
            </button>
          </div>

          <div className="border-t border-slate-700 pt-3 space-y-2">
            <input
              className="w-full rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <select
              className="w-full rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              value={form.event_type}
              onChange={(e) =>
                setForm((f) => ({ ...f, event_type: e.target.value as EventType }))
              }
            >
              <option value="utsav">Utsav</option>
              <option value="manorath">Manorath</option>
              <option value="task">Task</option>
              <option value="other">Other</option>
            </select>
            <textarea
              className="w-full rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
              rows={2}
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
            <button
              type="button"
              disabled={loading || !form.title.trim()}
              onClick={addEvent}
              className="w-full rounded bg-orange-600 hover:bg-orange-500 py-1.5 disabled:opacity-50"
            >
              Add event
            </button>
          </div>

          <ul className="space-y-1">
            {events
              .filter((e) => e.start_date === selected)
              .map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between items-center gap-2 rounded bg-slate-900/60 px-2 py-1"
                >
                  <span>
                    {e.title} <span className="text-slate-500">({e.event_type})</span>
                  </span>
                  <button
                    type="button"
                    className="text-xs text-red-400"
                    onClick={async () => {
                      if (e.id && confirm('Delete event?')) {
                        await deleteEvent(e.id)
                        const { from, to } = monthRange(year, month)
                        setEvents(await listEventsInRange(from, to))
                      }
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Panchang data is user-entered. Tithi boundaries depend on location and tradition.
        Do not treat unverified entries as authoritative.
      </p>
    </div>
  )
}
