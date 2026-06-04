import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import ApiKeyGuard from '@/components/setup/ApiKeyGuard'

export default async function GalleryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  return (
    <ApiKeyGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader active="gallery" />

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-6 pb-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">הגלריה שלי</h1>
            <p className="text-white/40 text-sm">כל היצירות שנשמרו בדפדפן שלך</p>
          </div>

          <GalleryGrid />
        </main>

        <AppFooter />
      </div>
    </ApiKeyGuard>
  )
}
