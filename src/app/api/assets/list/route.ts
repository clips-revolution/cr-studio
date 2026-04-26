import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    const userId = session.user.id ?? session.user.email ?? 'unknown'

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const supabase = getServiceClient()
    let query = supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (type) query = query.eq('type', type)

    const { data, error } = await query
    if (error) throw new Error(error.message)

    return NextResponse.json({ assets: data ?? [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה בטעינת גלריה'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
