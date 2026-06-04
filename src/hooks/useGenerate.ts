'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { localStorageStorage } from '@/lib/clientStorage'

const API_KEY_STORAGE = 'replicate_api_key'

function getApiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(API_KEY_STORAGE)
}

interface GenerateOptions {
  endpoint: '/api/images/generate' | '/api/videos/generate'
  type: 'image' | 'video'
  body: Record<string, unknown>
}

async function uploadFile(dataUrl: string, apiKey: string): Promise<string> {
  const blob = await fetch(dataUrl).then(r => r.blob())
  const fd = new FormData()
  fd.append('file', blob)
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'X-Replicate-Key': apiKey },
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'שגיאה בהעלאת קובץ')
  return data.url
}

async function uploadInputs(body: Record<string, unknown>, apiKey: string): Promise<Record<string, unknown>> {
  const result = { ...body }
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && value.startsWith('data:')) {
      result[key] = await uploadFile(value, apiKey)
    } else if (Array.isArray(value)) {
      result[key] = await Promise.all(
        value.map(v => typeof v === 'string' && v.startsWith('data:') ? uploadFile(v, apiKey) : v)
      )
    }
  }
  return result
}

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function generate(options: GenerateOptions) {
    const apiKey = getApiKey()
    if (!apiKey) {
      toast.error('יש להזין מפתח Replicate API תחילה')
      return
    }

    setLoading(true)
    setResult(null)
    try {
      // שלב 1: העלה קבצים מקומיים (data URLs → Replicate Files API)
      const cleanBody = await uploadInputs(options.body, apiKey)

      // שלב 2: הפעל יצירה
      const startRes = await fetch(options.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Replicate-Key': apiKey,
        },
        body: JSON.stringify(cleanBody),
      })
      const startData = await startRes.json()
      if (!startRes.ok) throw new Error(startData.error ?? 'שגיאה בהפעלת היצירה')

      const { predictionId } = startData

      // שלב 3: polling כל 3 שניות עד לתוצאה
      let attempts = 0
      const maxAttempts = 100

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000))
        const pollRes = await fetch(`/api/poll?id=${predictionId}`, {
          headers: { 'X-Replicate-Key': apiKey },
        })
        const poll = await pollRes.json()

        if (poll.status === 'failed') {
          if (poll.logs) console.error('[Replicate logs]', poll.logs)
          throw new Error(`היצירה נכשלה: ${poll.error ?? 'שגיאה לא ידועה'}`)
        }
        if (poll.status === 'succeeded' && poll.output) {
          const outputUrl = Array.isArray(poll.output) ? poll.output[0] : poll.output

          // שלב 4: שמור ב-localStorage (אפס שרת)
          await localStorageStorage.save({
            user_id: '',
            type: options.type,
            url: outputUrl,
            prompt: String(options.body.prompt ?? ''),
            model: String(options.body.model ?? ''),
            metadata: {},
          })

          setResult(outputUrl)
          toast.success(options.type === 'image' ? 'התמונה נוצרה!' : 'הסרטון נוצר!')
          return
        }
        attempts++
      }
      throw new Error('תם הזמן. נסה שוב.')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה לא צפויה')
    } finally {
      setLoading(false)
    }
  }

  return { loading, result, generate, setResult }
}
