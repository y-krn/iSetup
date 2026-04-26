import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeScreenshot } from '@/lib/claude'

const BUCKET = 'screenshots'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor')
  const tag = searchParams.get('tag')
  const theme = searchParams.get('theme')
  const limit = 20

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) query = query.lt('created_at', cursor)
  if (tag) query = query.contains('extracted_tags->apps', JSON.stringify([tag]))
  if (theme) query = query.eq('extracted_tags->>theme', theme)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const anonUserId = formData.get('anon_user_id') as string | null

    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })

    const supabase = createAdminClient()

    // Upload to Storage
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
    const imageUrl = urlData.publicUrl

    // AI analysis
    let extractedTags = {}
    try {
      extractedTags = await analyzeScreenshot(imageUrl)
    } catch (e) {
      console.warn('AI analysis failed, continuing without tags:', e)
    }

    // Insert post
    const { data, error } = await supabase
      .from('posts')
      .insert({ image_url: imageUrl, image_path: path, anon_user_id: anonUserId, extracted_tags: extractedTags })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    console.error('post error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
