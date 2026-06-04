'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'replicate_api_key'

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setApiKeyState(localStorage.getItem(STORAGE_KEY))
    setLoaded(true)
  }, [])

  function setApiKey(key: string) {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKeyState(key)
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY)
    setApiKeyState(null)
  }

  return { apiKey, setApiKey, clearApiKey, loaded }
}
