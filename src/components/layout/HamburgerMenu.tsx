'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Hamburger button — fixed top-right */}
      <button
        onClick={() => setOpen(true)}
        aria-label="פתח תפריט"
        aria-expanded={open}
        className="fixed top-[1.1rem] right-5 z-[100] flex flex-col gap-[5px] cursor-pointer p-[6px] bg-white/5 border border-white/[0.08] rounded-[10px] hover:bg-white/10 transition-colors"
      >
        <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
        <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
        <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[199] transition-colors duration-300 ${
          open ? 'bg-black/60 pointer-events-auto' : 'bg-transparent pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        className={`fixed top-0 right-0 bottom-0 z-[200] w-[min(280px,75vw)] bg-[rgba(10,10,12,0.98)] backdrop-blur-[28px] border-l border-white/[0.07] flex flex-col p-8 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          aria-label="סגור תפריט"
          className="self-start w-[34px] h-[34px] flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-lg text-white mb-6 hover:bg-white/[0.12] transition-colors"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8 pb-6 border-b border-white/[0.07]">
          <Image src="/clips-revolution-logo.png" alt="clips.Revolution" width={56} height={56} className="object-contain" />
          <Image src="/logo.png" alt="cR Studio" width={48} height={48} className="object-contain" />
        </div>

        {/* Links */}
        <a
          href="https://clipsrevolution.com"
          className="text-[1.05rem] font-semibold text-white/65 py-[0.9rem] border-b border-white/5 hover:text-white transition-colors"
        >
          חזור לדף הבית
        </a>
      </div>
    </>
  )
}
