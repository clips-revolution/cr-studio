'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, ImageIcon, Play, Video, X } from 'lucide-react'
import { downloadFile } from '@/lib/download'
import type { Asset } from '@/types'

function VideoLightbox({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        <video
          src={asset.url}
          controls
          autoPlay
          className="w-full rounded-2xl shadow-2xl"
        />

        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-white/50 text-xs line-clamp-1 flex-1 ml-3">{asset.prompt}</p>
          <button
            onClick={() => downloadFile(asset.url, 'cr-studio-video.mp4')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs text-white/70 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> הורד
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 border border-white/15 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}

export default function GalleryGrid({ assets }: { assets: Asset[] }) {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [preview, setPreview] = useState<Asset | null>(null)

  const filtered = assets.filter(a => filter === 'all' || a.type === filter)

  if (assets.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-xl">הגלריה שלך ריקה עדיין</p>
        <p className="mt-2">צור תמונות וסרטונים — הם יופיעו כאן</p>
      </div>
    )
  }

  return (
    <>
      {preview && <VideoLightbox asset={preview} onClose={() => setPreview(null)} />}

      <div>
        <div className="flex gap-2 mb-8">
          {(['all', 'image', 'video'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              {f === 'all' ? 'הכל' : f === 'image' ? 'תמונות' : 'סרטונים'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(asset => (
            <div
              key={asset.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
            >
              {asset.type === 'image' ? (
                <div className="aspect-square relative">
                  <Image
                    src={asset.url}
                    alt={asset.prompt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div
                  className="aspect-video relative bg-black cursor-pointer"
                  onClick={() => setPreview(asset)}
                >
                  <video src={asset.url} className="w-full h-full object-cover" muted preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-white/35 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-110">
                      <Play className="w-5 h-5 text-white fill-white mr-[-2px]" />
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none">
                <p className="text-white text-xs line-clamp-3">{asset.prompt}</p>
                <div className="flex items-center justify-between pointer-events-auto">
                  <span className="text-white/60 text-xs">{asset.model.split('/').pop()}</span>
                  <button
                    onClick={e => { e.stopPropagation(); downloadFile(asset.url, `cr-studio-${asset.type}.${asset.type === 'video' ? 'mp4' : 'png'}`) }}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
