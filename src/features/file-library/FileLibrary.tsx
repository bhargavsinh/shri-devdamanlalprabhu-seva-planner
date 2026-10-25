import { useEffect, useState } from 'react'
import {
  listFiles,
  importFile,
  deleteFile,
  downloadFile,
} from '../../db/repositories/fileRepository'
import type { FileMeta } from '../../db/schema'

export function FileLibrary() {
  const [files, setFiles] = useState<FileMeta[]>([])
  const [busy, setBusy] = useState(false)

  async function reload() {
    setFiles(await listFiles())
  }

  useEffect(() => {
    reload()
  }, [])

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files
    if (!list?.length) return
    setBusy(true)
    try {
      for (const f of Array.from(list)) {
        await importFile(f)
      }
      await reload()
    } catch (err) {
      console.error(err)
      alert('Import failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">File Library</h2>
          <p className="text-sm text-slate-400">PDF, images, DOC stored locally as Blobs</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-4 py-2">
          {busy ? 'Importing…' : 'Import files'}
          <input
            type="file"
            multiple
            className="hidden"
            disabled={busy}
            onChange={onImport}
          />
        </label>
      </section>

      {files.length === 0 ? (
        <p className="text-slate-400 text-sm">No files yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-100">{f.name}</p>
                <p className="text-xs text-slate-500">
                  {(f.size_bytes / 1024).toFixed(1)} KB · {f.mime_type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
                  onClick={() => f.id && downloadFile(f.id)}
                >
                  Download
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-950/40"
                  onClick={async () => {
                    if (f.id && confirm('Delete this file?')) {
                      await deleteFile(f.id)
                      await reload()
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
