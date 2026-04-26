'use client'

import { useState } from 'react'
import { Download, Images, Loader2, Upload, Video } from 'lucide-react'
import { VIDEO_MODELS } from '@/lib/models'
import { useGenerate } from '@/hooks/useGenerate'
import { downloadFile } from '@/lib/download'
import ModelSelector from '@/components/shared/ModelSelector'
import GalleryPicker from '@/components/shared/GalleryPicker'
import Image from 'next/image'

const SUPPORTED_MODELS = VIDEO_MODELS.filter(m => m.supports_image_input)

type GalleryTarget = 'start' | 'end' | null

export default function ImageToVideo() {
  const [prompt, setPrompt] = useState('')
  const [startImage, setStartImage] = useState<string | null>(null)
  const [endImage, setEndImage] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(SUPPORTED_MODELS[0].id)
  const [duration, setDuration] = useState(5)
  const [galleryTarget, setGalleryTarget] = useState<GalleryTarget>(null)
  const { loading, result, generate } = useGenerate()

  const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModel) ?? SUPPORTED_MODELS[0]

  function handleImageUpload(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setter(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function handleGallerySelect(url: string) {
    if (galleryTarget === 'start') setStartImage(url)
    if (galleryTarget === 'end') setEndImage(url)
  }

  async function handleGenerate() {
    if (!startImage) return
    await generate({
      endpoint: '/api/videos/generate',
      type: 'video',
      body: {
        prompt: prompt || 'animate naturally',
        model: selectedModel,
        image_url: startImage,
        ...(endImage && currentModel.supports_end_frame ? { end_image_url: endImage } : {}),
        duration,
      },
    })
  }

  function FrameUpload({
    label, image, onFile, onGallery, disabled = false,
  }: {
    label: string
    image: string | null
    onFile: (e: React.ChangeEvent<HTMLInputElement>) => void
    onGallery: () => void
    disabled?: boolean
  }) {
    return (
      <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <div className={`border-2 border-dashed rounded-xl text-center transition-colors mb-2 ${image ? 'border-white/30 bg-white/5 p-3' : 'border-white/10 p-4'}`}>
          {image ? (
            <Image src={image} alt={label} width={200} height={150} className="mx-auto rounded max-h-28 w-auto" unoptimized />
          ) : (
            <div className="py-2 text-white/25">
              <Upload className="w-6 h-6 mx-auto mb-1" />
              <p className="text-xs">פריים</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <label className="cursor-pointer">
            <div className="flex items-center justify-center gap-1.5 border border-white/10 rounded-lg py-2 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors">
              <Upload className="w-3 h-3" /> העלאה
            </div>
            <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={disabled} />
          </label>
          <button
            onClick={onGallery}
            className="flex items-center justify-center gap-1.5 border border-white/10 rounded-lg py-2 text-xs text-white/50 hover:text-blue-300 hover:border-blue-500/40 transition-colors"
          >
            <Images className="w-3 h-3" /> גלריה
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {galleryTarget && (
        <GalleryPicker
          onSelect={handleGallerySelect}
          onClose={() => setGalleryTarget(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls — top on mobile, RIGHT on desktop */}
        <div className="space-y-6 order-1">
          <div className="grid grid-cols-2 gap-4">
            <FrameUpload
              label="תמונת פתיחה *"
              image={startImage}
              onFile={handleImageUpload(setStartImage)}
              onGallery={() => setGalleryTarget('start')}
            />
            <FrameUpload
              label={`תמונת סיום${!currentModel.supports_end_frame ? ' (לא נתמך)' : ''}`}
              image={endImage}
              onFile={handleImageUpload(setEndImage)}
              onGallery={() => setGalleryTarget('end')}
              disabled={!currentModel.supports_end_frame}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">תיאור נוסף (אופציונלי)</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              placeholder="לדוגמה: תנועת מצלמה איטית, אווירת שקיעה, רוח קלה"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">מודל AI</label>
            <ModelSelector
              models={SUPPORTED_MODELS}
              selected={selectedModel}
              onChange={(id) => {
                setSelectedModel(id)
                const m = SUPPORTED_MODELS.find(v => v.id === id)
                if (m) {
                  setDuration(Math.min(duration, m.max_duration))
                  if (!m.supports_end_frame) setEndImage(null)
                }
              }}
              accent="blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">משך: {duration}s</label>
            <input type="range" min="3" max={currentModel.max_duration} step="1" value={duration}
              onChange={e => setDuration(parseInt(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <button onClick={handleGenerate} disabled={loading || !startImage}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium py-4 px-6 rounded-xl transition-all disabled:opacity-40 text-sm">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> מייצר סרטון... (עד 2 דקות)</> : <><Video className="w-4 h-4" /> הנפש את התמונה</>}
          </button>
        </div>

        {/* Preview — bottom on mobile, LEFT on desktop */}
        <div className="flex items-center justify-center order-2">
          {result ? (
            <div className="space-y-3 w-full">
              <video src={result} controls autoPlay loop className="w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]" />
              <button onClick={() => downloadFile(result, 'cr-studio-video.mp4')} className="flex items-center justify-center gap-2 w-full border border-white/10 rounded-xl py-3 text-sm text-white/60 hover:text-white hover:border-white/25 transition-colors">
                <Download className="w-4 h-4" /> הורד סרטון
              </button>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.07)_0%,transparent_65%)]" />
              <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-white/[0.12]" />
              <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/[0.12]" />
              <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/[0.12]" />
              <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-white/[0.12]" />
              <div className="text-center text-white/25 relative z-10">
                {loading ? (
                  <><Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin" /><p className="text-sm">מייצר... סרטונים לוקחים 1-2 דקות</p></>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center">
                      <Video className="w-7 h-7 opacity-40" />
                    </div>
                    <p className="text-sm">הסרטון יופיע כאן</p>
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
