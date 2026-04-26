'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

interface Props {
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function UserMenu({ name, email, image }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? 'משתמש'}
            width={34}
            height={34}
            className="rounded-full ring-1 ring-white/20"
          />
        ) : (
          <div className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/20">
            <User className="w-4 h-4 text-white/60" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-12 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-4 border-b border-white/8">
            <div className="flex items-center gap-3">
              {image ? (
                <Image src={image} alt={name ?? ''} width={40} height={40} className="rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-white/60" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{name ?? 'משתמש'}</p>
                <p className="text-white/40 text-xs truncate ltr">{email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <Link
              href="/gallery"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              הגלריה שלי
            </Link>
            <Link
              href="/auth/signout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              יציאה
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
