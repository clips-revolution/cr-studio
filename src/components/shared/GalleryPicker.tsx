'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Images } from 'lucide-react'
import Image from 'next/image'
import type { Asset } from '@/types'

interface Props {
  onSelect: (url: string) => void
  onClose: () => void
}

export default function GalleryPicker({ onSelect, onClose }: Props) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/assets/list?type=image')
      .then(r => r.json())
      .then(data => setAssets(data.assets ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-white text-sm font-medium">בחר מהגלריה</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-white/30" />
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-16 text-white/25">
              <Images className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">אין תמונות בגלריה עדיין</p>
              <p className="text-xs mt-1 opacity-60">צור תמונות קודם ואז תוכל לבחור מכאן</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {assets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => { onSelect(asset.url); onClose() }}
                  className="aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-purple-500/50 transition-all duration-150 group relative"
                >
                  <Image
                    src={asset.url}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
