# SDSP — Shri Devdaman Seva Planner

**Version 1.0 (Foundation + Local DBMS + Nitya Seva Register)**

Private, local-first Progressive Web App for managing Nitya Seva records of Shri Devdamanlal Prabhu.

Architecture principle: local-first storage, privacy by design, explicit backups (later phases), and evidence-based release acceptance.

## Current scope (Phases 1–3)

- React + TypeScript + Tailwind CSS + Vite
- PWA shell (manifest + service worker via vite-plugin-pwa)
- IndexedDB via Dexie.js with versioned schema
- Zod validation on write paths
- Dashboard with today’s progress
- Nitya Seva Register (CRUD-style status + notes per day)
- Default seva types seeded on first load
- GitHub Pages base path configured

**Not yet in this release:** Calendar/Panchang, File Library, Inventory, full Backup/Restore, Reminders, Auth lock, Supabase.

## Quick start

```bash
git clone https://github.com/bhargavsinh/shri-devdamanlalprabhu-seva-planner.git
cd shri-devdamanlalprabhu-seva-planner
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build for GitHub Pages

```bash
npm run build
```

Deploy the `dist/` folder to GitHub Pages (Settings → Pages → Deploy from branch / gh-pages or Actions).

Base path is already set to `/shri-devdamanlalprabhu-seva-planner/`.

## Important storage note

IndexedDB is browser-managed. Quotas, clearing site data, or device failure can lose data. **Local storage is not a backup.** A proper export/import flow will be added in a later phase. Until then, treat this as a personal tool on a trusted device.

## CLAUDE.md

All contributors and agents must follow the four rules in `CLAUDE.md`.

## Status

Architecture and Phase 1–3 implementation only. No claim is made that later blueprint features are present or tested.
