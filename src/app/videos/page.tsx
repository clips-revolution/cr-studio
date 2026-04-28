import SeedanceStudio from '@/components/videos/TextToVideo'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader active="videos" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-36 pb-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">יצירת סרטונים</h1>
          <p className="text-white/40 text-sm">סרטונים קולנועיים מטקסט, תמונות ואודיו</p>
        </div>

        <SeedanceStudio />
      </main>

      <AppFooter />
    </div>
  )
}
