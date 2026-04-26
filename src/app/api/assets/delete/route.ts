import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'

const BUCKET = 'assets'

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

    const userId = session.user.id ?? session.user.email ?? 'unknown'
    const { id, url } = await req.json()
    if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 })

    const supabase = getServiceClient()

    // וודא שה-asset שייך למשתמש הזה
    const { data: asset } = await supabase
      .from('assets')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!asset) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 })

    // מחק מה-storage
    if (url) {
      const match = url.match(/\/storage\/v1\/object\/public\/assets\/(.+)/)
      if (match?.[1]) {
        await supabase.storage.from(BUCKET).remove([match[1]])
      }
    }

    // מחק מה-DB
    await supabase.from('assets').delete().eq('id', id)

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה במחיקה'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
