import { getServiceClient } from '@/lib/supabase'

const BUCKET = 'assets'

export async function uploadFromUrl(
  userId: string,
  sourceUrl: string,
  type: 'image' | 'video'
): Promise<string> {
  const response = await fetch(sourceUrl)
  const blob = await response.blob()
  const ext = type === 'video' ? 'mp4' : 'webp'
  const path = `${userId}/${Date.now()}.${ext}`

  const supabase = getServiceClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || (type === 'video' ? 'video/mp4' : 'image/webp'),
    upsert: false,
  })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
  'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
  'audio/mpeg': 'mp3', 'audio/mp4': 'm4a', 'audio/wav': 'wav', 'audio/ogg': 'ogg', 'audio/webm': 'weba',
}

export async function uploadFromDataUrl(dataUrl: string, userId: string): Promise<string> {
  const commaIdx = dataUrl.indexOf(',')
  if (commaIdx === -1) throw new Error('Invalid data URL')

  const header = dataUrl.slice(0, commaIdx)
  const base64 = dataUrl.slice(commaIdx + 1)
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'application/octet-stream'
  const ext = EXT_MAP[mimeType] ?? 'bin'
  const path = `${userId}/inputs/${Date.now()}.${ext}`

  const buffer = Buffer.from(base64, 'base64')
  const supabase = getServiceClient()

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteAsset(userId: string, path: string): Promise<void> {
  const supabase = getServiceClient()
  const relativePath = path.split(`${BUCKET}/`)[1]
  if (!relativePath?.startsWith(userId)) throw new Error('Unauthorized delete attempt')
  await supabase.storage.from(BUCKET).remove([relativePath])
}
