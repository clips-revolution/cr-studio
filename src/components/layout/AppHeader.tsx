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
      {/* שורה 1: אווטאר שמאל + כפתור בית ימין */}
      <div className="flex items-center justify-between px-5 pt-6">
        <UserMenu
          name={session?.user?.name}
          email={session?.user?.email}
          image={session?.user?.image}
        />
        <Link href="/">
          <div className="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white/[0.06] border border-white/8 hover:bg-white/12 hover:border-white/15 transition-all">
            <Home className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      {/* שורה 2: ניווט */}
      <div className="flex justify-center pt-2">
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
