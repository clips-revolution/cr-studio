'use client'

import { useApiKey } from '@/hooks/useApiKey'
import ApiKeySetup from './ApiKeySetup'

export default function ApiKeyGuard({ children }: { children: React.ReactNode }) {
  const { apiKey, loaded } = useApiKey()

  return (
    <>
      {children}
      {loaded && !apiKey && <ApiKeySetup />}
    </>
  )
}
