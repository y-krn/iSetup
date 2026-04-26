import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'screenshots'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { anonUserId } = await req.json()
    if (!anonUserId) return NextResponse.json({ error: 'anonUserId required' }, { status: 400 })

    const supabase = createAdminClient()

    // 投稿取得 + 認可確認
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('id, image_path, anon_user_id')
      .eq('id', id)
      .single()

    if (fetchError || !post) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (post.anon_user_id !== anonUserId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    // Storage画像削除
    await supabase.storage.from(BUCKET).remove([post.image_path])

    // DB削除 (likes は cascade)
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id)
    if (deleteError) throw deleteError

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('delete error:', e)
    return NextResponse.json({ error: 'delete failed' }, { status: 500 })
  }
}
