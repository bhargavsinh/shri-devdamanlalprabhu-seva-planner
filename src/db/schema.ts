import Dexie, { type EntityTable } from 'dexie'

export type SevaStatus = 'pending' | 'completed' | 'skipped' | 'partial'
export type EventType = 'utsav' | 'manorath' | 'task' | 'other'
export type ItemType = 'vastra' | 'shringar' | 'material' | 'other'

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
  date_key: string
  seva_type_id: number
  status: SevaStatus
  notes: string
  created_at: string
  updated_at: string
  revision: number
}

export interface CalendarEvent {
  id?: number
  title: string
  start_date: string
  end_date: string
  event_type: EventType
  reminder_at: string | null
  notes: string
  created_at: string
  updated_at: string
}

export interface PanchangEntry {
  id?: number
  gregorian_date: string
  vikram_samvat: string
  month_name: string
  paksha: string
  tithi: string
  source: string
  verified_at: string | null
  created_at: string
}

export interface FileMeta {
  id?: number
  name: string
  mime_type: string
  size_bytes: number
  checksum: string
  tags: string
  category: string
  created_at: string
}

export interface FileBlob {
  id?: number
  file_id: number
  blob: Blob
}

export interface SevaItem {
  id?: number
  name: string
  item_type: ItemType
  color: string
  quantity: number
  unit: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Reminder {
  id?: number
  event_id: number | null
  title: string
  scheduled_at: string
  status: 'pending' | 'done' | 'dismissed'
  created_at: string
}

export interface Settings {
  id?: number
  key: string
  value: string
}

export class SdspDatabase extends Dexie {
  seva_types!: EntityTable<SevaType, 'id'>
  seva_records!: EntityTable<SevaRecord, 'id'>
  calendar_events!: EntityTable<CalendarEvent, 'id'>
  panchang_entries!: EntityTable<PanchangEntry, 'id'>
  files!: EntityTable<FileMeta, 'id'>
  file_blobs!: EntityTable<FileBlob, 'id'>
  seva_items!: EntityTable<SevaItem, 'id'>
  reminders!: EntityTable<Reminder, 'id'>
  settings!: EntityTable<Settings, 'id'>

  constructor() {
    super('sdsp_v1')

    this.version(1).stores({
      seva_types: '++id, name, category, sequence, is_active',
      seva_records: '++id, date_key, seva_type_id, status, [date_key+seva_type_id]',
      settings: '++id, key',
    })

    this.version(2).stores({
      seva_types: '++id, name, category, sequence, is_active',
      seva_records: '++id, date_key, seva_type_id, status, [date_key+seva_type_id]',
      calendar_events: '++id, start_date, end_date, event_type',
      panchang_entries: '++id, gregorian_date, verified_at',
      files: '++id, name, mime_type, category, created_at',
      file_blobs: '++id, file_id',
      seva_items: '++id, item_type, name',
      reminders: '++id, scheduled_at, status',
      settings: '++id, key',
    })
  }
}

export const db = new SdspDatabase()
