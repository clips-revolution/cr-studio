import { NextRequest, NextResponse } from 'next/server'
import { getPrediction } from '@/services/replicateService'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 })

  const apiKey = req.headers.get('X-Replicate-Key')
  if (!apiKey) return NextResponse.json({ error: 'חסר מפתח Replicate API' }, { status: 400 })

  const prediction = await getPrediction(id, apiKey)
  return NextResponse.json({
    status: prediction.status,
    output: prediction.output,
    error: prediction.error,
    logs: prediction.logs,
  })
}
