'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface GenerateOptions {
  endpoint: '/api/images/generate' | '/api/videos/generate'
  type: 'image' | 'video'
  body: Record<string, unknown>
}

async function uploadFile(dataUrl: string): Promise<string> {
  const blob = await fetch(dataUrl).then(r => r.blob())
  const fd = new FormData()
  fd.append('file', blob)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'שגיאה בהעלאת קובץ')
  return data.url
}

async function uploadInputs(body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const result = { ...body }
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && value.startsWith('data:')) {
      result[key] = await uploadFile(value)
    } else if (Array.isArray(value)) {
      result[key] = await Promise.all(
        value.map(v => typeof v === 'string' && v.startsWith('data:') ? uploadFile(v) : v)
      )
    }
  }
  return result
}

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function generate(options: GenerateOptions) {
    setLoading(true)
    setResult(null)
    try {
      // שלב 1: העלה קבצים מקומיים לפני שליחה (data URLs → Supabase URLs)
      const cleanBody = await uploadInputs(options.body)

      // שלב 2: הפעל יצירה (מהיר — חוזר מיד עם predictionId)
      const startRes = await fetch(options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanBody),
      })
      const startData = await startRes.json()
      if (!startRes.ok) throw new Error(startData.error ?? 'שגיאה בהפעלת היצירה')

      const { predictionId } = startData

      // שלב 2: polling כל 3 שניות עד לתוצאה
      let attempts = 0
      const maxAttempts = 100

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000))
        const pollRes = await fetch(`/api/poll?id=${predictionId}`)
        const poll = await pollRes.json()

        if (poll.status === 'failed') {
          const reason = poll.error ?? 'שגיאה לא ידועה'
          if (poll.logs) console.error('[Replicate logs]', poll.logs)
          throw new Error(`היצירה נכשלה: ${reason}`)
        }
        if (poll.status === 'succeeded' && poll.output) {
          const replicateUrl = Array.isArray(poll.output) ? poll.output[0] : poll.output

          // שלב 3: שמור ב-Supabase
          const saveRes = await fetch('/api/assets/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: replicateUrl,
              type: options.type,
              prompt: options.body.prompt,
              model: options.body.model,
              metadata: {},
            }),
          })
          const saveData = await saveRes.json()
          if (!saveRes.ok) throw new Error(saveData.error ?? 'שגיאה בשמירה')

          setResult(saveData.url)
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
