'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push('/auth/login')
    })
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/40 text-sm">מתנתק...</p>
    </div>
  )
}
