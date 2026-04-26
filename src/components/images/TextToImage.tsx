'use client'

import { useState } from 'react'
import { Download, Images, Loader2, Plus, Upload, Wand2, X } from 'lucide-react'
import { useGenerate } from '@/hooks/useGenerate'
import { downloadFile } from '@/lib/download'
import GalleryPicker from '@/components/shared/GalleryPicker'
import Image from 'next/image'

const MODEL_ID = 'google/nano-banana-2'
const MAX_IMAGES = 9

const SIZES = [
  { label: 'ריבוע',      sub: '1:1',   ratio: '1:1'  },
  { label: 'רוחבי',      sub: '16:9',  ratio: '16:9' },
  { label: 'אנכי',       sub: '9:16',  ratio: '9:16' },
  { label: 'צילום',      sub: '3:2',   ratio: '3:2'  },
  { label: 'צילום אנכי', sub: '2:3',   ratio: '2:3'  },
  { label: 'קלאסי',      sub: '4:3',   ratio: '4:3'  },
  { label: 'קלאסי אנכי', sub: '3:4',   ratio: '3:4'  },
  { label: 'סטוריז',     sub: '4:5',   ratio: '4:5'  },
  { label: 'פנורמי',     sub: '21:9',  ratio: '21:9' },
  { label: 'פורטרט',     sub: '5:4',   ratio: '5:4'  },
]

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [selectedRatio, setSelectedRatio] = useState('1:1')
  const [showGallery, setShowGallery] = useState(false)
  const { loading, result, generate } = useGenerate()

  function readAsDataURL(file: File): Promise<string> {
    return new Promise(resolve => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.readAsDataURL(file)
    })
  }

  async function handleImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) return
    const dataUrls = await Promise.all(files.slice(0, remaining).map(readAsDataURL))
    setImages(prev => [...prev, ...dataUrls])
    e.target.value = ''
  }

  function handleGallerySelect(url: string) {
    if (images.length < MAX_IMAGES) setImages(prev => [...prev, url])
    setShowGallery(false)
  }

  async function handleGenerate() {
    if (!prompt.trim()) return
    await generate({
      endpoint: '/api/images/generate',
      type: 'image',
      body: {
        prompt,
        model: MODEL_ID,
        aspect_ratio: selectedRatio,
        ...(images.length > 0 ? { image_urls: images } : {}),
      },
    })
  }

  return (
    <>
      {showGallery && (
        <GalleryPicker onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} />
      )}

      {/* RTL grid: first column = RIGHT, second column = LEFT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Controls — RIGHT (first in DOM = right column in RTL) */}
        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">תאר את התמונה שאתה רוצה ליצור</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              placeholder="לדוגמה: עיר עתידנית מוארת בשעת לילה, צבעים ססגוניים, איכות גבוהה"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 resize-none text-sm"
            />
          </div>

          {/* Image attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                צרף תמונה <span className="text-white/30 font-normal">(אופציונלי · עד {MAX_IMAGES})</span>
              </label>
              <span className="text-xs text-white/30">{images.length > 0 ? `${images.length}/${MAX_IMAGES}` : ''}</span>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
                    <button onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <label className="cursor-pointer aspect-square rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors">
                    <Plus className="w-4 h-4 text-white/25" />
                    <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {images.length === 0 && (
              <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 rounded-xl py-2.5 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> העלה תמונות
                  <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" />
                </label>
                <button onClick={() => setShowGallery(true)}
                  className="flex items-center justify-center gap-1.5 border border-white/10 rounded-xl py-2.5 text-xs text-white/50 hover:text-purple-300 hover:border-purple-500/40 transition-colors">
                  <Images className="w-3.5 h-3.5" /> מהגלריה
                </button>
              </div>
            )}
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-2">גודל</label>
            <div className="grid grid-cols-5 gap-1.5">
              {SIZES.map(s => (
                <button key={s.ratio} onClick={() => setSelectedRatio(s.ratio)}
                  className={`text-xs p-2 rounded-lg border transition-colors text-center ${selectedRatio === s.ratio ? 'border-orange-500/50 bg-orange-500/10 text-orange-300' : 'border-white/8 hover:border-white/20 text-white/50'}`}>
                  <div className="text-[11px]">{s.label}</div>
                  <div className="opacity-50 text-[9px] mt-0.5">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate — orange + magic shimmer */}
          <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
            className="relative overflow-hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 border border-orange-400/40 text-white font-medium py-4 px-6 rounded-xl transition-all disabled:opacity-40 text-sm shadow-[0_4px_24px_rgba(249,115,22,0.25)]">
            {loading && (
              <span className="magic-shimmer absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            )}
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> מייצר תמונה...</>
              : <><Wand2 className="w-4 h-4" /> צור תמונה</>}
          </button>
        </div>

        {/* Preview — LEFT (second in DOM = left column in RTL) */}
        <div className="flex items-center justify-center">
          {result ? (
            <div className="space-y-3 w-full">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <Image src={result} alt="תמונה שנוצרה" width={1024} height={1024} className="w-full h-auto" unoptimized />
              </div>
              <button onClick={() => downloadFile(result, 'cr-studio-image.png')}
                className="flex items-center justify-center gap-2 w-full border border-white/10 rounded-xl py-3 text-sm text-white/60 hover:text-white hover:border-white/25 transition-colors">
                <Download className="w-4 h-4" /> הורד תמונה
              </button>
            </div>
          ) : (
            <div className="w-full aspect-square rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06)_0%,transparent_65%)]" />
              <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-white/[0.12]" />
              <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/[0.12]" />
              <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/[0.12]" />
              <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-white/[0.12]" />
              <div className="text-center text-white/25 relative z-10">
                {loading ? (
                  <><Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-orange-400/60" /><p className="text-sm">מייצר... כ-20 שניות</p></>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center">
                      <Wand2 className="w-7 h-7 opacity-40" />
                    </div>
                    <p className="text-sm">התמונה תופיע כאן</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
