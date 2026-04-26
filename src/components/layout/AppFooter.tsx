import Image from 'next/image'

export default function AppFooter() {
  return (
    <footer className="mt-20 pb-10 text-center flex flex-col items-center gap-4">
      <p className="text-[9px] tracking-[0.12em] text-slate-500/60 ltr" style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Powered by clips.Revolution</p>
      <Image src="/clips-revolution-logo.png" alt="clips.Revolution" width={40} height={12} className="opacity-70 drop-shadow-[0_0_4px_rgba(255,255,255,0.25)]" />
    </footer>
  )
}
