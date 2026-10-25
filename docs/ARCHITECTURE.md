# SDSP Architecture (V1 — Phases 1–3)

## Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| UI             | React 19 + TypeScript               |
| Styling        | Tailwind CSS v4                     |
| Routing        | React Router                        |
| Local DB       | IndexedDB via Dexie.js              |
| Validation     | Zod                                 |
| PWA            | vite-plugin-pwa                     |
| Hosting target | GitHub Pages (static)               |

## Source of truth

Local IndexedDB database (`sdsp_v1`) is the sole source of truth in V1.

## Data model (implemented)

- `seva_types` — id, name, category, sequence, is_active, timestamps
- `seva_records` — id, date_key, seva_type_id, status, notes, timestamps, revision
- `settings` — reserved for later

## Routes

- `/` — Dashboard (today’s progress)
- `/seva` — Nitya Seva Register (date picker + status + notes)

## Next phases (not implemented)

See the Technical Blueprint PDF for Calendar, Panchang, File Library, Inventory, Backup/Restore, Reminders, Security, and optional Supabase.
