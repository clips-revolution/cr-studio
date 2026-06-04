import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

    const apiKey = req.headers.get('X-Replicate-Key')
    if (!apiKey) return NextResponse.json({ error: 'חסר מפתח Replicate API' }, { status: 400 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'חסר קובץ' }, { status: 400 })

    const buffer = await file.arrayBuffer()

    // העלאת קובץ ישירות ל-Replicate Files API — ישמר בחשבון של המשתמש
    const res = await fetch('https://api.replicate.com/v1/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': file.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name || 'upload'}"`,
      },
      body: buffer,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.detail ?? data.error ?? 'שגיאה בהעלאת קובץ ל-Replicate')

    const url = data.urls?.get ?? data.url
    if (!url) throw new Error('Replicate לא החזיר URL לקובץ')

    return NextResponse.json({ url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה לא צפויה'
    console.error('[upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
