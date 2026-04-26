import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateVideo } from '@/services/replicateService'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

    const body = await req.json()
    const { prompt, model, image_url, end_image_url, video_url, audio_url, duration, aspect_ratio, resolution } = body
    if (!prompt || !model) return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })

    const prediction = await generateVideo({
      prompt, model, image_url, end_image_url, video_url, audio_url, duration, aspect_ratio, resolution,
    })
    return NextResponse.json({ predictionId: prediction.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה לא צפויה'
    console.error('[videos/generate]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
