import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Home } from 'lucide-react'
import UserMenu from './UserMenu'

interface Props {
  active: 'images' | 'videos' | 'gallery'
}

export default async function AppHeader({ active }: Props) {
  const session = await getServerSession(authOptions)

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* פרופיל — קבוע בצד שמאל */}
      <div className="absolute top-6 left-5 z-50">
        <UserMenu
          name={session?.user?.name}
          email={session?.user?.email}
          image={session?.user?.image}
        />
      </div>

      {/* כפתור בית — צד ימין */}
      <div className="absolute top-6 right-5 z-50">
        <Link href="/">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/8 hover:bg-white/12 hover:border-white/15 transition-all">
            <Home className="w-3.5 h-3.5 text-white/50 hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      {/* ניווט — מרכז */}
      <div className="flex justify-center pt-6">
        <nav className="flex items-center gap-1 bg-white/[0.06] backdrop-blur-md border border-white/8 rounded-2xl px-1.5 py-1.5">
          <Link href="/images">
            <div className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active === 'images'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white hover:bg-white/8'
            }`}>
              תמונות
            </div>
          </Link>
          <Link href="/videos">
            <div className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active === 'videos'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white hover:bg-white/8'
            }`}>
              סרטונים
            </div>
          </Link>
          <Link href="/gallery">
            <div className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active === 'gallery'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white hover:bg-white/8'
            }`}>
              גלריה
            </div>
          </Link>
        </nav>
      </div>
    </header>
  )
}
