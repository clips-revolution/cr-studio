import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
  'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
  'audio/mpeg': 'mp3', 'audio/mp4': 'm4a', 'audio/wav': 'wav', 'audio/ogg': 'ogg',
}

const BUCKET = 'assets'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

    const userId = session.user.id ?? session.user.email ?? 'unknown'
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'חסר קובץ' }, { status: 400 })

    const mimeType = file.type || 'application/octet-stream'
    const ext = EXT_MAP[mimeType] ?? 'bin'
    const path = `${userId}/inputs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const supabase = getServiceClient()

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    })
    if (error) throw new Error(`Upload failed: ${error.message}`)

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה לא צפויה'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
