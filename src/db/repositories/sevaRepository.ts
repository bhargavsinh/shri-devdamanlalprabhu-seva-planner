import { db, type SevaRecord, type SevaStatus, type SevaType } from '../schema'
import { z } from 'zod'

const SevaTypeSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  sequence: z.number().int().min(0),
  is_active: z.boolean(),
})

const SevaRecordSchema = z.object({
  date_key: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  seva_type_id: z.number().int().positive(),
  status: z.enum(['pending', 'completed', 'skipped', 'partial']),
  notes: z.string().max(2000),
})

function nowIso() {
  return new Date().toISOString()
}

export async function listSevaTypes(activeOnly = true): Promise<SevaType[]> {
  let coll = db.seva_types.orderBy('sequence')
  if (activeOnly) {
    return coll.filter((t) => t.is_active).toArray()
  }
  return coll.toArray()
}

export async function createSevaType(
  input: z.infer<typeof SevaTypeSchema>
): Promise<number> {
  const data = SevaTypeSchema.parse(input)
  const ts = nowIso()
  return db.seva_types.add({
    ...data,
    created_at: ts,
    updated_at: ts,
  })
}

export async function seedDefaultSevaTypes(): Promise<void> {
  const count = await db.seva_types.count()
  if (count > 0) return

  const defaults: Array<z.infer<typeof SevaTypeSchema>> = [
    { name: 'Mangala', category: 'Nitya', sequence: 1, is_active: true },
    { name: 'Shringar', category: 'Nitya', sequence: 2, is_active: true },
    { name: 'Rajbhog', category: 'Nitya', sequence: 3, is_active: true },
    { name: 'Utthapan', category: 'Nitya', sequence: 4, is_active: true },
    { name: 'Bhog', category: 'Nitya', sequence: 5, is_active: true },
    { name: 'Sandhya Aarti', category: 'Nitya', sequence: 6, is_active: true },
    { name: 'Shayan', category: 'Nitya', sequence: 7, is_active: true },
  ]

  const ts = nowIso()
  await db.seva_types.bulkAdd(
    defaults.map((d) => ({
      ...d,
      created_at: ts,
      updated_at: ts,
    }))
  )
}

export async function getRecordsForDate(dateKey: string): Promise<SevaRecord[]> {
  return db.seva_records.where('date_key').equals(dateKey).toArray()
}

export async function upsertSevaRecord(
  input: z.infer<typeof SevaRecordSchema>
): Promise<number> {
  const data = SevaRecordSchema.parse(input)
  const existing = await db.seva_records
    .where('[date_key+seva_type_id]')
    .equals([data.date_key, data.seva_type_id])
    .first()

  const ts = nowIso()

  if (existing?.id != null) {
    await db.seva_records.update(existing.id, {
      status: data.status,
      notes: data.notes,
      updated_at: ts,
      revision: (existing.revision ?? 0) + 1,
    })
    return existing.id
  }

  return db.seva_records.add({
    ...data,
    created_at: ts,
    updated_at: ts,
    revision: 1,
  })
}

export async function updateRecordStatus(
  id: number,
  status: SevaStatus,
  notes?: string
): Promise<void> {
  const existing = await db.seva_records.get(id)
  if (!existing) throw new Error('Record not found')

  await db.seva_records.update(id, {
    status,
    notes: notes ?? existing.notes,
    updated_at: nowIso(),
    revision: (existing.revision ?? 0) + 1,
  })
}

export async function deleteSevaRecord(id: number): Promise<void> {
  await db.seva_records.delete(id)
}

export async function getTodayKey(): Promise<string> {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
