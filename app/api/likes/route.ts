import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { postId, anonUserId } = await req.json()
  if (!postId || !anonUserId) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('likes').insert({ post_id: postId, anon_user_id: anonUserId })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { postId, anonUserId } = await req.json()
  if (!postId || !anonUserId) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('anon_user_id', anonUserId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  const anonUserId = searchParams.get('anonUserId')
  if (!postId || !anonUserId) return NextResponse.json({ liked: false })

  const supabase = createAdminClient()
  const { data } = await supabase.from('likes').select('id').eq('post_id', postId).eq('anon_user_id', anonUserId).maybeSingle()

  return NextResponse.json({ liked: !!data })
}
