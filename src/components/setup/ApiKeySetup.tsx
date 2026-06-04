'use client'

import { useState } from 'react'
import { Key, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { useApiKey } from '@/hooks/useApiKey'

interface Props {
  onSaved?: (key: string) => void
}

export default function ApiKeySetup({ onSaved }: Props) {
  const { setApiKey } = useApiKey()
  const [input, setInput] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed.startsWith('r8_')) {
      setError('מפתח Replicate API חייב להתחיל ב-r8_')
      return
    }
    setApiKey(trimmed)
    onSaved?.(trimmed)
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">חיבור מפתח API</h2>
            <p className="text-white/40 text-xs">נדרש כדי להשתמש ב-cR Studio</p>
          </div>
        </div>

        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          כדי ליצור תמונות וסרטונים תזדקק למפתח Replicate API אישי.
          המפתח נשמר <strong className="text-white/80">רק בדפדפן שלך</strong> ולא מועבר לשרתים שלנו.
        </p>

        <div className="relative mb-3">
          <input
            type={showKey ? 'text' : 'password'}
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            placeholder="r8_xxxxxxxxxxxxxxxxxxxx"
            dir="ltr"
            autoComplete="new-password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 transition-colors pr-12"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors mb-5"
        >
          שמור מפתח והתחל
        </button>

        <a
          href="https://replicate.com/account/api-tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-purple-400/70 hover:text-purple-300 text-xs transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          קבל מפתח API ב-Replicate.com
        </a>
      </div>
    </div>
  )
}
