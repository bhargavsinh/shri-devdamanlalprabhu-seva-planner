# SDSP Architecture (V1)

## Stack

| Layer | Technology |
|-------|------------|
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Local DB | IndexedDB via Dexie.js (versioned) |
| Validation | Zod |
| PWA | vite-plugin-pwa |
| Hosting | GitHub Pages |

## Source of truth

Local IndexedDB (`sdsp_v1`) is the sole source of truth.

## Implemented modules

- Dashboard + Nitya Seva Register
- Calendar + manual Gujarati Panchang entry
- File Library (Blob + SHA-256 checksum)
- Seva Materials Inventory (Vastra / Shringar / Materials)
- Local PIN lock (UI gate only — not encryption)

## Explicitly deferred

- Phase 7: full Backup/Restore with integrity + Reminders
- Automated Panchang engine
- Optional Supabase sync

## Data model

See `src/db/schema.ts` for tables and version 2 migration.
