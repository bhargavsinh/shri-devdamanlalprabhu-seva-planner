import Dexie, { type EntityTable } from 'dexie'

export type SevaStatus = 'pending' | 'completed' | 'skipped' | 'partial'

export interface SevaType {
  id?: number
  name: string
  category: string
  sequence: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SevaRecord {
  id?: number
  date_key: string // YYYY-MM-DD
  seva_type_id: number
  status: SevaStatus
  notes: string
  created_at: string
  updated_at: string
  revision: number
}

export interface Settings {
  id?: number
  key: string
  value: string
}

export class SdspDatabase extends Dexie {
  seva_types!: EntityTable<SevaType, 'id'>
  seva_records!: EntityTable<SevaRecord, 'id'>
  settings!: EntityTable<Settings, 'id'>

  constructor() {
    super('sdsp_v1')
    this.version(1).stores({
      seva_types: '++id, name, category, sequence, is_active',
      seva_records: '++id, date_key, seva_type_id, status, [date_key+seva_type_id]',
      settings: '++id, key',
    })
  }
}

export const db = new SdspDatabase()
