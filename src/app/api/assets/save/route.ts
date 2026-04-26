import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadFromUrl } from '@/services/storageService'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    const userId = session.user.id ?? session.user.email ?? 'unknown'

    const { url, type, prompt, model, metadata } = await req.json()
    if (!url || !type) return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })

    let finalUrl = url
    try {
      finalUrl = await uploadFromUrl(userId, url, type)
    } catch (uploadErr) {
      console.warn('[assets/save] storage upload failed, using source url:', uploadErr)
    }

    const supabase = getServiceClient()
    await supabase.from('assets').insert({ user_id: userId, type, url: finalUrl, prompt, model, metadata: metadata ?? {} })

    return NextResponse.json({ url: finalUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה בשמירה'
    console.error('[assets/save]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
