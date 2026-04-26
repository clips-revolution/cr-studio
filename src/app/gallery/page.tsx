import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getServiceClient } from '@/lib/supabase'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import type { Asset } from '@/types'

export const revalidate = 0

export default async function GalleryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const userId = session.user?.id ?? session.user?.email ?? ''
  const supabase = getServiceClient()
  const { data: assets, error } = await supabase
    .from('assets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) console.error('[gallery]', error.message)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader active="gallery" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">הגלריה שלי</h1>
          <p className="text-white/40 text-sm">{assets?.length ?? 0} יצירות</p>
        </div>

        <div className="mb-6 inline-flex items-start gap-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
          <span className="text-yellow-400 text-sm font-semibold flex-shrink-0">!</span>
          <p className="text-yellow-300 text-sm">חשוב לציין שהסרטונים והתמונות בגלריה לא מופיעים באיכות המלאה שלהם</p>
        </div>
        <GalleryGrid assets={(assets as Asset[]) ?? []} />
      </main>

      <AppFooter />
    </div>
  )
}
