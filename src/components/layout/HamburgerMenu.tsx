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
        className="flex flex-col gap-[5px] cursor-pointer p-[6px] bg-white/5 border border-white/[0.08] rounded-[10px] hover:bg-white/10 transition-colors"
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
        <div className="flex justify-center mb-8 pb-6 border-b border-white/[0.07]">
          <Image src="/clips-revolution-logo.png" alt="clips.Revolution" width={56} height={56} className="object-contain" />
        </div>

        {/* Links */}
        <a
          href="https://clipsrevolution.com"
          className="flex items-center gap-[0.65rem] text-[1.05rem] font-semibold text-white/65 py-[0.9rem] border-b border-white/5 hover:text-white transition-colors"
        >
          <span className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)', boxShadow: '0 2px 10px rgba(168,85,247,0.4)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
          </span>
          חזור לדף הבית
        </a>
      </div>
    </>
  )
}
