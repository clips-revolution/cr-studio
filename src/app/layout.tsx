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
  title: 'cR Studio — ייצור תמונות וסרטונים עם Ai',
  description: 'פלטפורמת Ai ראשונה בעברית לייצור תמונות וסרטונים',
  icons: {
    icon: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
    shortcut: '/apple-touch-icon.png',
  },
  openGraph: {
    images: ['https://clipsrevolution.com/social-preview.png'],
  },
  twitter: {
    images: ['https://clipsrevolution.com/social-preview.png'],
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
