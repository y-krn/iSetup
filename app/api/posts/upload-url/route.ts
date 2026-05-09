import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'screenshots'
type Locale = 'ja' | 'en'

function getLocale(req: NextRequest): Locale {
  return new URL(req.url).searchParams.get('locale') === 'en' ? 'en' : 'ja'
}

function message(locale: Locale, ja: string, en: string) {
  return locale === 'en' ? en : ja
}

export async function POST(req: NextRequest) {
  const locale = getLocale(req)
  // 認証 (匿名拒否)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: message(locale, '認証が必要です', 'Login is required.') }, { status: 401 })
  if (user.is_anonymous) return NextResponse.json({ error: message(locale, '投稿にはメール認証が必要です', 'Email login is required to post.') }, { status: 403 })

  // サーバ側で path 生成 (path injection 防止)
  const path = `temp/${Date.now()}-${Math.random().toString(36).slice(2)}.bin`

  const admin = createAdminClient()
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path)
  if (error) {
    console.error('createSignedUploadUrl failed:', error)
    return NextResponse.json({ error: message(locale, 'アップロードURLの作成に失敗しました', 'Could not prepare the upload.') }, { status: 500 })
  }

  return NextResponse.json({ token: data.token, path: data.path })
}
