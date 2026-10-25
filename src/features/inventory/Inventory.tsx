import { useEffect, useState } from 'react'
import {
  listItems,
  createItem,
  deleteItem,
} from '../../db/repositories/inventoryRepository'
import type { ItemType, SevaItem } from '../../db/schema'

const TYPES: ItemType[] = ['vastra', 'shringar', 'material', 'other']

export function Inventory() {
  const [items, setItems] = useState<SevaItem[]>([])
  const [form, setForm] = useState({
    name: '',
    item_type: 'vastra' as ItemType,
    color: '',
    quantity: 1,
    unit: 'pcs',
    notes: '',
  })

  async function reload() {
    setItems(await listItems())
  }

  useEffect(() => {
    reload()
  }, [])

  async function onAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    await createItem(form)
    setForm({
      name: '',
      item_type: 'vastra',
      color: '',
      quantity: 1,
      unit: 'pcs',
      notes: '',
    })
    await reload()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seva Materials Inventory</h2>
      <p className="text-sm text-slate-400">Vastra, Shringar, and materials</p>

      <form onSubmit={onAdd} className="grid sm:grid-cols-2 gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm">
        <input
          className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5 sm:col-span-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <select
          className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
          value={form.item_type}
          onChange={(e) =>
            setForm((f) => ({ ...f, item_type: e.target.value as ItemType }))
          }
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
          placeholder="Color"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
        />
        <input
          type="number"
          min={0}
          step="any"
          className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
          value={form.quantity}
          onChange={(e) =>
            setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
          }
        />
        <input
          className="rounded border border-slate-600 bg-slate-900 px-2 py-1.5"
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded bg-orange-600 hover:bg-orange-500 py-2 font-medium"
        >
          Add item
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex justify-between items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{it.name}</p>
              <p className="text-xs text-slate-500">
                {it.item_type} · {it.quantity} {it.unit}
                {it.color ? ` · ${it.color}` : ''}
              </p>
            </div>
            <button
              type="button"
              className="text-xs text-red-400"
              onClick={async () => {
                if (it.id && confirm('Delete?')) {
                  await deleteItem(it.id)
                  await reload()
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
