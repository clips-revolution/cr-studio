'use client'

import { useState } from 'react'
import { Download, Images, Loader2, Upload, Wand2 } from 'lucide-react'
import { useGenerate } from '@/hooks/useGenerate'
import { downloadFile } from '@/lib/download'
import GalleryPicker from '@/components/shared/GalleryPicker'
import Image from 'next/image'

const MODEL_ID = 'google/nano-banana-2'

export default function ImageToImage() {
  const [prompt, setPrompt] = useState('')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState(false)
  const { loading, result, generate } = useGenerate()

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSourceImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleGenerate() {
    if (!prompt.trim() || !sourceImage) return
    await generate({
      endpoint: '/api/images/generate',
      type: 'image',
      body: { prompt, model: MODEL_ID, image_url: sourceImage },
    })
  }

  return (
    <>
      {showGallery && (
        <GalleryPicker
          onSelect={url => setSourceImage(url)}
          onClose={() => setShowGallery(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6 order-2">
          <div>
            <label className="block text-sm font-medium mb-2">תמונת מקור</label>
            <div className={`border-2 border-dashed rounded-xl text-center transition-colors ${sourceImage ? 'border-white/30 bg-white/5 p-4' : 'border-white/10 p-6'}`}>
              {sourceImage ? (
                <Image src={sourceImage} alt="תמונת מקור" width={300} height={200} className="mx-auto rounded-lg max-h-48 w-auto" unoptimized />
              ) : (
                <div className="py-2 text-white/25">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">העלה תמונה או בחר מהגלריה</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 border border-white/10 rounded-xl py-2.5 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> העלאה
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button
                onClick={() => setShowGallery(true)}
                className="flex items-center justify-center gap-2 border border-white/10 rounded-xl py-2.5 text-xs text-white/50 hover:text-purple-300 hover:border-purple-500/40 transition-colors"
              >
                <Images className="w-3.5 h-3.5" /> מהגלריה
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">תיאור השינוי הרצוי</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              placeholder="לדוגמה: הפוך לציור שמן בסגנון אימפרסיוניסטי, שנה לצבע סגול"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 resize-none text-sm"
            />
          </div>

          <button onClick={handleGenerate} disabled={loading || !prompt.trim() || !sourceImage}
            className={`w-full flex items-center justify-center gap-2 border font-medium py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-40 text-sm text-white ${loading ? 'bg-purple-600 border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)]' : 'bg-white/10 hover:bg-white/15 border-white/15'}`}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> מייצר תמונה...</> : <><Wand2 className="w-4 h-4" /> צור תמונה חדשה</>}
          </button>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center order-1">
          {result ? (
            <div className="space-y-3 w-full">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <Image src={result} alt="תמונה שנוצרה" width={1024} height={1024} className="w-full h-auto" unoptimized />
              </div>
              <button onClick={() => downloadFile(result, 'cr-studio-image.png')} className="flex items-center justify-center gap-2 w-full border border-white/10 rounded-xl py-3 text-sm text-white/60 hover:text-white hover:border-white/25 transition-colors">
                <Download className="w-4 h-4" /> הורד תמונה
              </button>
            </div>
          ) : (
            <div className="w-full aspect-square rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.07)_0%,transparent_65%)]" />
              <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-white/[0.12]" />
              <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/[0.12]" />
              <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/[0.12]" />
              <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-white/[0.12]" />
              <div className="text-center text-white/25 relative z-10">
                {loading ? (
                  <><Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin" /><p className="text-sm">מייצר... זה לוקח כ-20 שניות</p></>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center">
                      <Wand2 className="w-7 h-7 opacity-40" />
                    </div>
                    <p className="text-sm">התמונה שתיצור תופיע כאן</p>
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
