'use client'

import { useRef, useState } from 'react'
import { Download, Images, Loader2, Music, Plus, Upload, Video, X } from 'lucide-react'
import { useGenerate } from '@/hooks/useGenerate'
import { downloadFile } from '@/lib/download'
import GalleryPicker from '@/components/shared/GalleryPicker'
import Image from 'next/image'

const MODEL_ID = 'bytedance/seedance-2.0'
const MAX_IMAGES = 9

const RATIOS = [
  { label: 'רוחבי',   sub: '16:9', value: '16:9' },
  { label: 'אנכי',    sub: '9:16', value: '9:16' },
  { label: 'ריבוע',   sub: '1:1',  value: '1:1'  },
  { label: 'קולנועי', sub: '21:9', value: '21:9' },
]

type TagEntry = { tag: string; label: string }

export default function SeedanceStudio() {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const [audioFileName, setAudioFileName] = useState('')
  const [duration, setDuration] = useState(8)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [usageApproved, setUsageApproved] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [tagCursorPos, setTagCursorPos] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { loading, result, generate } = useGenerate()

  const availableTags: TagEntry[] = [
    ...(images.length > 0 ? [{ tag: '@תמונה', label: `${images.length} תמונות` }] : []),
    ...(audioFile ? [{ tag: '@אודיו', label: 'אודיו' }] : []),
  ]

  function handlePromptChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setPrompt(val)
    const cursor = e.target.selectionStart ?? 0
    const beforeCursor = val.slice(0, cursor)
    const lastAt = beforeCursor.lastIndexOf('@')
    if (lastAt !== -1 && !beforeCursor.slice(lastAt + 1).includes(' ') && availableTags.length > 0) {
      setShowTagMenu(true)
      setTagCursorPos(lastAt)
    } else {
      setShowTagMenu(false)
    }
  }

  function insertTag(tag: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const cursor = textarea.selectionStart ?? tagCursorPos
    const newPrompt = prompt.slice(0, tagCursorPos) + tag + ' ' + prompt.slice(cursor)
    setPrompt(newPrompt)
    setShowTagMenu(false)
    setTimeout(() => {
      if (textareaRef.current) {
        const pos = tagCursorPos + tag.length + 1
        textareaRef.current.setSelectionRange(pos, pos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  function appendTag(tag: string) {
    const prefix = prompt && !prompt.endsWith(' ') ? ' ' : ''
    setPrompt(prompt + prefix + tag + ' ')
    textareaRef.current?.focus()
  }

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
    const toAdd = files.slice(0, remaining)
    const dataUrls = await Promise.all(toAdd.map(readAsDataURL))
    setImages(prev => [...prev, ...dataUrls])
    e.target.value = ''
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleAudioFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAudioFileName(file.name)
    setAudioFile(await readAsDataURL(file))
  }

  function handleGallerySelect(url: string) {
    if (images.length < MAX_IMAGES) setImages(prev => [...prev, url])
    setShowGallery(false)
  }

  async function handleGenerate() {
    if (!prompt.trim() || !usageApproved) return
    await generate({
      endpoint: '/api/videos/generate',
      type: 'video',
      body: {
        prompt,
        model: MODEL_ID,
        ...(images[0] ? { image_url: images[0] } : {}),
        ...(audioFile ? { audio_url: audioFile } : {}),
        duration,
        aspect_ratio: aspectRatio,
        resolution: '1080p',
      },
    })
  }

  return (
    <>
      {showGallery && (
        <GalleryPicker onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} />
      )}

      {/* Seedance 2.0 header badge */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-teal-500/20 bg-gradient-to-r from-teal-950/60 via-cyan-950/40 to-teal-950/60 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-30%,rgba(20,184,166,0.18)_0%,transparent_65%)] pointer-events-none" />
        <div className="relative flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-teal-500/30 select-none">
              S
            </div>
            <div>
              <div className="text-sm font-bold text-teal-100 leading-tight ltr">Seedance 2.0</div>
              <div className="text-xs text-teal-400/60 ltr">by ByteDance</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/25 text-xs text-teal-300 font-semibold ltr">1080p</div>
            <div className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/25 text-xs text-teal-300 font-medium">AI Video</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5 order-1">

          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-right">תאר את הסרטון</label>
              {availableTags.length > 0
                ? <span className="text-[11px] text-white/30">הקלד @ לתייג קבצים</span>
                : <span />}
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handlePromptChange}
                onBlur={() => setTimeout(() => setShowTagMenu(false), 120)}
                rows={4}
                placeholder="לדוגמה: גל ים מתנפץ על חוף סלעי בזריחה, תנועה איטית..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 resize-none text-sm"
              />
              {showTagMenu && availableTags.length > 0 && (
                <div className="absolute bottom-full mb-1 right-0 z-20 bg-zinc-900 border border-white/15 rounded-xl overflow-hidden shadow-2xl min-w-[170px]">
                  {availableTags.map(t => (
                    <button
                      key={t.tag}
                      onMouseDown={e => { e.preventDefault(); insertTag(t.tag) }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-teal-500/10 text-right transition-colors"
                    >
                      <span className="text-teal-400 font-mono text-xs font-semibold ltr">{t.tag}</span>
                      <span className="text-white/40 text-xs">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {availableTags.map(t => (
                  <button key={t.tag} onClick={() => appendTag(t.tag)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-xs text-teal-400 hover:bg-teal-500/20 transition-colors ltr">
                    {t.tag} <span className="text-teal-500/50 text-[10px] mr-0.5">+</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Media uploads */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                תמונות <span className="text-white/30 font-normal">(אופציונלי · עד {MAX_IMAGES})</span>
              </label>
              {images.length > 0 && (
                <span className="text-xs text-white/30">{images.length}/{MAX_IMAGES}</span>
              )}
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <Image src={src} alt="" fill className="object-cover" unoptimized />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 inset-x-0 py-0.5 bg-black/60 text-center text-[9px] text-teal-300">
                      ראשית
                    </div>
                  )}
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <div className="aspect-square rounded-xl border border-dashed border-white/15 grid grid-cols-1">
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-1 hover:border-white/30 hover:bg-white/5 transition-colors rounded-xl">
                    <Plus className="w-4 h-4 text-white/25" />
                    <span className="text-[10px] text-white/25">הוסף</span>
                    <input
                      type="file" accept="image/*" multiple
                      onChange={handleImageFiles} className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Upload + gallery buttons */}
            {images.length < MAX_IMAGES && (
              <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 rounded-xl py-2 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> העלה תמונות
                  <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" />
                </label>
                <button onClick={() => setShowGallery(true)}
                  className="flex items-center justify-center gap-1.5 border border-white/10 rounded-xl py-2 text-xs text-white/50 hover:text-teal-300 hover:border-teal-500/40 transition-colors">
                  <Images className="w-3.5 h-3.5" /> מהגלריה
                </button>
              </div>
            )}

            {/* Audio */}
            <div className="mt-3">
              {audioFile ? (
                <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2.5 bg-white/[0.025]">
                  <div className="flex items-center gap-2 text-xs text-white/60 min-w-0">
                    <Music className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{audioFileName}</span>
                  </div>
                  <button onClick={() => { setAudioFile(null); setAudioFileName('') }}
                    className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0 mr-2">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 rounded-xl py-2 text-xs text-white/50 hover:text-white hover:border-white/25 transition-colors w-full">
                  <Music className="w-3.5 h-3.5" /> העלה אודיו <span className="text-white/25">(אופציונלי)</span>
                  <input type="file" accept="audio/*" onChange={handleAudioFile} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">משך: {duration}s</label>
              <input type="range" min="4" max="15" step="1" value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                className="w-full accent-teal-500" />
              <div className="flex justify-between text-[10px] text-white/25 mt-1">
                <span>4s</span><span>15s</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">יחס תמונה</label>
              <div className="grid grid-cols-2 gap-1.5">
                {RATIOS.map(r => (
                  <button key={r.value} onClick={() => setAspectRatio(r.value)}
                    className={`text-xs py-1.5 px-2 rounded-lg border transition-colors text-center ${aspectRatio === r.value ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'border-white/8 hover:border-white/20 text-white/50'}`}>
                    {r.label}
                    <span className="block opacity-50 text-[10px]">{r.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Usage approval */}
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <div className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border transition-all ${usageApproved ? 'bg-teal-500 border-teal-500' : 'border-white/25 group-hover:border-white/50'}`}>
              {usageApproved && (
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input type="checkbox" checked={usageApproved} onChange={e => setUsageApproved(e.target.checked)} className="hidden" />
            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
              אני מאשר שהתוכן שהעלתי שייך לי ושיש לי רשות להשתמש בו, בהתאם ל
              <span className="text-teal-400 ltr"> Seedance Terms of Use</span>
            </span>
          </label>

          {/* Generate */}
          <button onClick={handleGenerate} disabled={loading || !prompt.trim() || !usageApproved}
            className="relative overflow-hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600/30 to-cyan-600/30 hover:from-teal-600/50 hover:to-cyan-600/50 border border-teal-500/25 hover:border-teal-500/45 text-white font-medium py-4 px-6 rounded-xl transition-all disabled:opacity-40 text-sm">
            {loading && (
              <span className="magic-shimmer absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            )}
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> מייצר סרטון... (1-2 דקות)</>
              : <><Video className="w-4 h-4" /> צור סרטון</>}
          </button>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center order-2">
          {result ? (
            <div className="space-y-3 w-full">
              <video src={result} controls autoPlay loop
                className="w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]" />
              <button onClick={() => downloadFile(result, 'cr-studio-video.mp4')}
                className="flex items-center justify-center gap-2 w-full border border-white/10 rounded-xl py-3 text-sm text-white/60 hover:text-white hover:border-white/25 transition-colors">
                <Download className="w-4 h-4" /> הורד סרטון
              </button>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.06)_0%,transparent_65%)]" />
              <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-teal-500/[0.15]" />
              <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-teal-500/[0.15]" />
              <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-teal-500/[0.15]" />
              <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-teal-500/[0.15]" />
              <div className="text-center text-white/25 relative z-10">
                {loading ? (
                  <><Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-teal-500/60" /><p className="text-sm">מייצר... סרטונים לוקחים 1-2 דקות</p></>
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
