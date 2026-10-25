# SDSP — Shri Devdaman Seva Planner

**Version 1.0** — Local-first Progressive Web App for Nitya Seva of Shri Devdamanlal Prabhu.

## Implemented (Phases 1–6 + 8)

- React + TypeScript + Tailwind + Vite + PWA shell
- IndexedDB / Dexie with versioned schema + Zod validation
- Dashboard + Nitya Seva Register (status + notes per day)
- Calendar (month view) + manual Gujarati Panchang entry with verification flag
- File Library (import PDF/images/docs as Blobs, SHA-256 checksum, download, delete)
- Seva Materials Inventory (Vastra / Shringar / Materials)
- Local PIN lock screen (UI gate only — data is **not** encrypted)
- Settings page

## Explicitly deferred (Phase 7)

Full Backup / Restore with integrity checks and production-ready Reminders are **not** claimed in this release. Placeholder pages exist so routes do not break.

## Quick start

```bash
git clone https://github.com/bhargavsinh/shri-devdamanlalprabhu-seva-planner.git
cd shri-devdamanlalprabhu-seva-planner
npm install
npm run dev
```

## GitHub Pages

```bash
npm run build
```

Base path is set to `/shri-devdamanlalprabhu-seva-planner/`.

## Important

IndexedDB is browser-managed storage. Clearing site data or device failure can lose records. **Local storage is not a backup.** Complete Phase 7 before relying on this for irreplaceable Seva history.

Panchang entries are user-sourced. Do not treat unverified Tithi as authoritative.

## CLAUDE.md

All changes must follow the four rules in `CLAUDE.md`.

## Status

Usable local-first V1 for daily Seva, calendar, files, and inventory. Phase 7 (Backup/Reminders) remains open.
