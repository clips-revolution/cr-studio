import ImageStudio from '@/components/images/TextToImage'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default function ImagesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader active="images" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-36 pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">יצירת תמונות</h1>
          <p className="text-white/40 text-sm">הפוך טקסט לתמונה, או עבד תמונה קיימת</p>
        </div>

        {/* Nano Banana 2 ticker */}
        <div className="mb-8 overflow-hidden rounded-xl border border-amber-500/15 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 ticker-pause">
          <div className="ticker-track py-2.5 items-center">
            {Array.from({ length: 2 }).map((_, copy) => (
              <div key={copy} className="flex items-center shrink-0">
                {Array.from({ length: 10 }).map((__, i) => (
                  <span key={i} className="flex items-center gap-3 px-5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 flex-shrink-0" />
                    <span className="text-xs font-semibold text-amber-300/70 tracking-wider ltr">Nano Banana 2</span>
                    <span className="text-xs text-amber-500/30">·</span>
                    <span className="text-[10px] text-amber-400/40 tracking-widest uppercase">by Google</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <ImageStudio />
      </main>

      <AppFooter />
    </div>
  )
}
