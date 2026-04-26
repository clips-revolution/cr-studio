export type AssetType = 'image' | 'video'

export interface Asset {
  id: string
  user_id: string
  type: AssetType
  url: string
  thumbnail_url?: string
  prompt: string
  model: string
  created_at: string
  metadata?: Record<string, unknown>
}

export interface ImageGenerationParams {
  prompt: string
  model: string
  negative_prompt?: string
  width?: number
  height?: number
  aspect_ratio?: string
  num_inference_steps?: number
  guidance_scale?: number
  image_url?: string
  image_urls?: string[]
  mask_url?: string
}

export interface VideoGenerationParams {
  prompt: string
  model: string
  image_url?: string
  end_image_url?: string
  video_url?: string
  audio_url?: string
  duration?: number
  aspect_ratio?: string
  resolution?: string
}

export interface Prediction {
  id: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: string | string[]
  error?: string
  logs?: string
}

export type ImageModel = {
  id: string
  name: string
  description: string
  supports_image_input: boolean
  supports_mask: boolean
}

export type VideoModel = {
  id: string
  name: string
  description: string
  supports_image_input: boolean
  supports_end_frame: boolean
  supports_audio: boolean
  max_duration: number
}
