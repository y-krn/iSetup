import { NextRequest, NextResponse } from 'next/server'
import { analyzeScreenshot } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

    const tags = await analyzeScreenshot(imageUrl)
    return NextResponse.json(tags)
  } catch (e) {
    console.error('analyze error:', e)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
