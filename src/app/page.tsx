import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import BackgroundGrid from '@/components/layout/BackgroundGrid'
import UserMenu from '@/components/layout/UserMenu'
import AppFooter from '@/components/layout/AppFooter'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  return (
    <div className="relative min-h-screen bg-black flex flex-col">

      <BackgroundGrid animate={true} />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/55 pointer-events-none" />

      {/* Profile — קבוע שמאל למעלה */}
      <div className="fixed top-4 left-5 z-50">
        <UserMenu
          name={session.user?.name}
          email={session.user?.email}
          image={session.user?.image}
        />
      </div>

      {/* Main content */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8">

        <div className="text-center mb-8 md:mb-14 max-w-2xl fade-up">
          <div className="mb-5">
            <h2 className="text-white text-4xl mb-4 tracking-widest text-center" style={{ fontFamily: 'var(--font-display)' }}>
              c<span className="text-purple-400">R</span> Studio
            </h2>
            <Image src="/logo.png" alt="cR Studio" width={160} height={48} className="mx-auto" priority />
          </div>

          <p className="text-white/40 text-xs tracking-widest uppercase mb-6 font-medium">
            הפכו רעיונות למציאות
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            צרו. דמיינו. תחלמו.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl fade-up-delay">
          <Link href="/images">
            <div className="group bg-white/[0.07] hover:bg-white/[0.13] backdrop-blur-md border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/25 transition-colors duration-300">
                <svg className="w-5 h-5 text-white/50 group-hover:text-purple-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 15-5-5L5 21"/>
                </svg>
              </div>
              <h2 className="font-semibold text-white">צרו תמונות</h2>
            </div>
          </Link>

          <Link href="/videos">
            <div className="group bg-white/[0.07] hover:bg-white/[0.13] backdrop-blur-md border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/25 transition-colors duration-300">
                <svg className="w-5 h-5 text-white/50 group-hover:text-blue-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"/>
                </svg>
              </div>
              <h2 className="font-semibold text-white">צרו סרטונים</h2>
            </div>
          </Link>

          <Link href="/gallery">
            <div className="group bg-white/[0.07] hover:bg-white/[0.13] backdrop-blur-md border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/25 transition-colors duration-300">
                <svg className="w-5 h-5 text-white/50 group-hover:text-emerald-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
                </svg>
              </div>
              <h2 className="font-semibold text-white">עיינו בגלריה</h2>
            </div>
          </Link>
        </div>
      </main>

      <div className="relative z-20">
        <AppFooter />
      </div>
    </div>
  )
}
