import type { Prediction, ImageGenerationParams, VideoGenerationParams } from '@/types'

const REPLICATE_API = 'https://api.replicate.com/v1'
const token = process.env.REPLICATE_API_TOKEN!

async function post(url: string, body: unknown): Promise<Prediction> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!text) throw new Error(`Replicate החזיר תגובה ריקה (status ${res.status})`)
  let data: Record<string, unknown>
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Replicate החזיר JSON שגוי: ${text.slice(0, 200)}`)
  }
  if (!res.ok) throw new Error(String(data?.detail ?? data?.error ?? `Replicate error ${res.status}`))
  return data as unknown as Prediction
}

export async function getPrediction(id: string): Promise<Prediction> {
  const res = await fetch(`${REPLICATE_API}/predictions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const text = await res.text()
  if (!text) throw new Error('תגובת polling ריקה')
  return JSON.parse(text)
}

export async function generateImage(params: ImageGenerationParams): Promise<Prediction> {
  const isNanoBanana = params.model.includes('nano-banana')

  if (isNanoBanana) {
    const imageInputs = params.image_urls ?? (params.image_url ? [params.image_url] : [])
    return post(`${REPLICATE_API}/models/${params.model}/predictions`, {
      input: {
        prompt: params.prompt,
        resolution: '1K',
        ...(imageInputs.length > 0
          ? { image_input: imageInputs, aspect_ratio: 'match_input_image' }
          : { aspect_ratio: params.aspect_ratio ?? '1:1' }),
      },
    })
  }

  return post(`${REPLICATE_API}/models/${params.model}/predictions`, {
    input: {
      prompt: params.prompt,
      ...(params.negative_prompt ? { negative_prompt: params.negative_prompt } : {}),
      ...(params.width ? { width: params.width } : {}),
      ...(params.height ? { height: params.height } : {}),
      ...(params.image_url ? { image: params.image_url } : {}),
    },
  })
}

export async function generateVideo(params: VideoGenerationParams): Promise<Prediction> {
  const isSeedance = params.model.includes('seedance')
  const isKling = params.model.includes('kling')
  const isVidu = params.model.includes('vidu')
  const usesStartEnd = isKling || isVidu

  const imageInput = params.image_url
    ? usesStartEnd
      ? { start_image: params.image_url }
      : { image: params.image_url }
    : {}

  const endImageInput = params.end_image_url && usesStartEnd
    ? { end_image: params.end_image_url }
    : {}

  const videoInput = params.video_url && isSeedance ? { video: params.video_url } : {}
  const audioInput = params.audio_url && isSeedance ? { audio: params.audio_url } : {}
  const resolutionInput = isSeedance ? { resolution: params.resolution ?? '1080p' } : {}

  return post(`${REPLICATE_API}/models/${params.model}/predictions`, {
    input: {
      prompt: params.prompt,
      ...(params.duration ? { duration: params.duration } : {}),
      ...(params.aspect_ratio ? { aspect_ratio: params.aspect_ratio } : {}),
      ...imageInput,
      ...endImageInput,
      ...videoInput,
      ...audioInput,
      ...resolutionInput,
    },
  })
}
