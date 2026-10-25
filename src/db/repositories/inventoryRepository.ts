import { db, type ItemType, type SevaItem } from '../schema'
import { z } from 'zod'

const ItemSchema = z.object({
  name: z.string().min(1).max(100),
  item_type: z.enum(['vastra', 'shringar', 'material', 'other']),
  color: z.string().max(50),
  quantity: z.number().min(0),
  unit: z.string().max(30),
  notes: z.string().max(500),
})

function nowIso() {
  return new Date().toISOString()
}

export async function listItems(type?: ItemType): Promise<SevaItem[]> {
  if (type) {
    return db.seva_items.where('item_type').equals(type).toArray()
  }
  return db.seva_items.orderBy('name').toArray()
}

export async function createItem(input: z.infer<typeof ItemSchema>): Promise<number> {
  const data = ItemSchema.parse(input)
  const ts = nowIso()
  return db.seva_items.add({
    ...data,
    created_at: ts,
    updated_at: ts,
  })
}

export async function updateItem(
  id: number,
  input: Partial<z.infer<typeof ItemSchema>>
): Promise<void> {
  await db.seva_items.update(id, {
    ...input,
    updated_at: nowIso(),
  })
}

export async function deleteItem(id: number): Promise<void> {
  await db.seva_items.delete(id)
}
