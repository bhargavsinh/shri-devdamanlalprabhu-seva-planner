import { db, type CalendarEvent, type EventType, type PanchangEntry } from '../schema'
import { z } from 'zod'

const EventSchema = z.object({
  title: z.string().min(1).max(200),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  event_type: z.enum(['utsav', 'manorath', 'task', 'other']),
  reminder_at: z.string().nullable(),
  notes: z.string().max(2000),
})

const PanchangSchema = z.object({
  gregorian_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vikram_samvat: z.string().max(50),
  month_name: z.string().max(50),
  paksha: z.string().max(30),
  tithi: z.string().max(50),
  source: z.string().max(200),
  verified_at: z.string().nullable(),
})

function nowIso() {
  return new Date().toISOString()
}

export async function listEventsInRange(from: string, to: string): Promise<CalendarEvent[]> {
  return db.calendar_events
    .where('start_date')
    .between(from, to, true, true)
    .toArray()
}

export async function createEvent(input: z.infer<typeof EventSchema>): Promise<number> {
  const data = EventSchema.parse(input)
  const ts = nowIso()
  return db.calendar_events.add({
    ...data,
    created_at: ts,
    updated_at: ts,
  })
}

export async function updateEvent(
  id: number,
  input: Partial<z.infer<typeof EventSchema>>
): Promise<void> {
  await db.calendar_events.update(id, {
    ...input,
    updated_at: nowIso(),
  })
}

export async function deleteEvent(id: number): Promise<void> {
  await db.calendar_events.delete(id)
}

export async function getPanchang(date: string): Promise<PanchangEntry | undefined> {
  return db.panchang_entries.where('gregorian_date').equals(date).first()
}

export async function upsertPanchang(
  input: z.infer<typeof PanchangSchema>
): Promise<number> {
  const data = PanchangSchema.parse(input)
  const existing = await db.panchang_entries
    .where('gregorian_date')
    .equals(data.gregorian_date)
    .first()
  if (existing?.id) {
    await db.panchang_entries.update(existing.id, data)
    return existing.id
  }
  return db.panchang_entries.add({
    ...data,
    created_at: nowIso(),
  })
}
