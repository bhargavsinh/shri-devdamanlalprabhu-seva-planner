export function BackupPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Backup</h2>
      <p className="text-sm text-slate-400">
        Phase 7 (full Backup / Restore) is intentionally not claimed in this release.
        A complete export/import with integrity checks will be added later.
      </p>
      <p className="text-xs text-slate-500">
        Until then, treat IndexedDB data as device-local only.
      </p>
    </div>
  )
}
