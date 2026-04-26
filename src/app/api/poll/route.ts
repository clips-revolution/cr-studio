import { NextRequest, NextResponse } from 'next/server'
import { getPrediction } from '@/services/replicateService'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 })

  const prediction = await getPrediction(id)
  return NextResponse.json({
    status: prediction.status,
    output: prediction.output,
    error: prediction.error,
    logs: prediction.logs,
  })
}
