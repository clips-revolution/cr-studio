import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Oswald, Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Providers from '@/components/layout/Providers'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const abraham = localFont({
  src: './fonts/Abraham-Regular.ttf',
  display: 'swap',
  weight: '100 900',
  variable: '--font-abraham',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-elegant',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cr.studio.clipsrevolution.com'),
  verification: { google: 'yZhAE9iG1d8WpdIQTvmJALGnkv7lbU2So1Lt_8nfWQQ' },

  title: 'cR Studio - ייצור תמונות וסרטונים ב-Ai',
  description: 'פלטפורמת Ai ראשונה בעברית לייצור תמונות וסרטונים',
    icons: [
    { rel: 'icon', url: '/favicon-v2.ico' },
    { rel: 'icon', url: '/favicon-48-v2.png', sizes: '48x48', type: 'image/png' },
    { rel: 'icon', url: '/favicon-32-v2.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', url: '/favicon-192-v2.png', sizes: '192x192', type: 'image/png' },
    { rel: 'icon', url: '/favicon-512-v2.png', sizes: '512x512', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/favicon-512-v2.png', sizes: '512x512', type: 'image/png' },
  ],

  openGraph: {
    images: ['https://cr.studio.clipsrevolution.com/cr-studio-og.png'],
  },
  twitter: {
    images: ['https://cr.studio.clipsrevolution.com/cr-studio-og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${abraham.variable} ${oswald.variable} ${cormorant.variable} ${outfit.variable}`}>
      <body className="font-sans">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
