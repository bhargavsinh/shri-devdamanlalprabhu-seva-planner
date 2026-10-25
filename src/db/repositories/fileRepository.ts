import { db, type FileMeta } from '../schema'
import { z } from 'zod'

const MetaSchema = z.object({
  name: z.string().min(1).max(255),
  mime_type: z.string().min(1),
  size_bytes: z.number().int().nonnegative(),
  checksum: z.string(),
  tags: z.string().max(500),
  category: z.string().max(50),
})

function nowIso() {
  return new Date().toISOString()
}

async function sha256(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer()
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function listFiles(): Promise<FileMeta[]> {
  return db.files.orderBy('created_at').reverse().toArray()
}

export async function importFile(
  file: File,
  category = 'general',
  tags = ''
): Promise<number> {
  const checksum = await sha256(file)
  const metaId = await db.files.add({
    name: file.name,
    mime_type: file.type || 'application/octet-stream',
    size_bytes: file.size,
    checksum,
    tags,
    category,
    created_at: nowIso(),
  })
  await db.file_blobs.add({ file_id: metaId, blob: file })
  return metaId
}

export async function getFileBlob(fileId: number): Promise<Blob | undefined> {
  const row = await db.file_blobs.where('file_id').equals(fileId).first()
  return row?.blob
}

export async function deleteFile(fileId: number): Promise<void> {
  await db.transaction('rw', db.files, db.file_blobs, async () => {
    await db.files.delete(fileId)
    await db.file_blobs.where('file_id').equals(fileId).delete()
  })
}

export async function downloadFile(fileId: number): Promise<void> {
  const meta = await db.files.get(fileId)
  const blob = await getFileBlob(fileId)
  if (!meta || !blob) throw new Error('File not found')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = meta.name
  a.click()
  URL.revokeObjectURL(url)
}
