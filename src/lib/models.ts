import type { ImageModel, VideoModel } from '@/types'

export const IMAGE_MODELS: ImageModel[] = [
  { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell', description: '', supports_image_input: true, supports_mask: false },
  { id: 'google/nano-banana-2', name: 'Nano Banana 2', description: '', supports_image_input: true, supports_mask: false },
  { id: 'bytedance/seedream-4.5', name: 'Seedream 4.5', description: '', supports_image_input: true, supports_mask: false },
  { id: 'black-forest-labs/flux-2-pro', name: 'Flux 2 Pro', description: '', supports_image_input: true, supports_mask: false },
  { id: 'black-forest-labs/flux-2-max', name: 'Flux 2 Max', description: '', supports_image_input: true, supports_mask: false },
  { id: 'black-forest-labs/flux-2-flex', name: 'Flux 2 Flex', description: '', supports_image_input: true, supports_mask: false },
  { id: 'google/imagen-4-ultra', name: 'Imagen 4 Ultra', description: '', supports_image_input: false, supports_mask: false },
  { id: 'google/imagen-4-fast', name: 'Imagen 4 Fast', description: '', supports_image_input: false, supports_mask: false },
  { id: 'bytedance/seedream-5-lite', name: 'Seedream 5 Lite', description: '', supports_image_input: true, supports_mask: false },
  { id: 'ideogram-ai/ideogram-v3-turbo', name: 'Ideogram v3 Turbo', description: '', supports_image_input: false, supports_mask: false },
  { id: 'recraft-ai/recraft-v4', name: 'Recraft V4', description: '', supports_image_input: false, supports_mask: false },
  { id: 'xai/grok-imagine-image', name: 'Grok Imagine', description: '', supports_image_input: false, supports_mask: false },
]

export const VIDEO_MODELS: VideoModel[] = [
  { id: 'kwaivgi/kling-v3-video', name: 'Kling 3.0', description: '', supports_image_input: true, supports_end_frame: true, supports_audio: true, max_duration: 10 },
  { id: 'bytedance/seedance-2.0', name: 'Seedance 2.0', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: true, max_duration: 5 },
  { id: 'bytedance/seedance-2.0-fast', name: 'Seedance 2.0 Fast', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: false, max_duration: 5 },
  { id: 'bytedance/seedance-1.5-pro', name: 'Seedance 1.5 Pro', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: true, max_duration: 8 },
  { id: 'minimax/hailuo-2.3', name: 'Hailuo 2.3', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: false, max_duration: 6 },
  { id: 'minimax/hailuo-2.3-fast', name: 'Hailuo 2.3 Fast', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: false, max_duration: 6 },
  { id: 'google/veo-3.1-fast', name: 'Veo 3.1 Fast', description: '', supports_image_input: false, supports_end_frame: false, supports_audio: true, max_duration: 8 },
  { id: 'google/veo-3.1-lite', name: 'Veo 3.1 Lite', description: '', supports_image_input: false, supports_end_frame: false, supports_audio: false, max_duration: 8 },
  { id: 'runwayml/gen-4.5', name: 'Runway Gen-4.5', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: false, max_duration: 10 },
  { id: 'pixverse/pixverse-v6', name: 'PixVerse v6', description: '', supports_image_input: true, supports_end_frame: false, supports_audio: true, max_duration: 8 },
  { id: 'kwaivgi/kling-v3-omni-video', name: 'Kling 3.0 Omni', description: '', supports_image_input: true, supports_end_frame: true, supports_audio: true, max_duration: 10 },
  { id: 'vidu/q3-pro', name: 'Vidu Q3 Pro', description: '', supports_image_input: true, supports_end_frame: true, supports_audio: false, max_duration: 16 },
  { id: 'wan-video/wan-2.7-t2v', name: 'Wan 2.7', description: '', supports_image_input: false, supports_end_frame: false, supports_audio: false, max_duration: 10 },
  { id: 'xai/grok-imagine-video', name: 'Grok Video', description: '', supports_image_input: false, supports_end_frame: false, supports_audio: true, max_duration: 5 },
]
