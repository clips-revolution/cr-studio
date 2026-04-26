'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ImageModel, VideoModel } from '@/types'

type Model = ImageModel | VideoModel

interface Props {
  models: Model[]
  selected: string
  onChange: (id: string) => void
  accent?: 'purple' | 'blue'
}

const VISIBLE_DEFAULT = 4

export default function ModelSelector({ models, selected, onChange, accent = 'purple' }: Props) {
  const [expanded, setExpanded] = useState(false)

  const visible = expanded ? models : models.slice(0, VISIBLE_DEFAULT)
  const accentClass = accent === 'purple' ? 'border-purple-500/50 bg-purple-500/5' : 'border-blue-500/50 bg-blue-500/5'
  const dotClass = accent === 'purple' ? 'bg-purple-400' : 'bg-blue-400'

  return (
    <div>
      <div className="space-y-1.5">
        {visible.map(model => (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-right transition-all duration-150 ${
              selected === model.id
                ? accentClass + ' border-opacity-50 text-white'
                : 'border-white/6 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.05] hover:border-white/12'
            }`}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${selected === model.id ? dotClass : 'bg-white/15'}`} />
            <span className="flex-1 text-right">{model.name}</span>
          </button>
        ))}
      </div>

      {models.length > VISIBLE_DEFAULT && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'הצג פחות' : `עוד ${models.length - VISIBLE_DEFAULT} מודלים`}
        </button>
      )}
    </div>
  )
}
