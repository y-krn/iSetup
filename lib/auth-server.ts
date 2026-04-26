import { createClient } from '@/lib/supabase/server'

/**
 * 認証済 (匿名でない) ユーザー取得。null なら未ログイン or 匿名のみ。
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.is_anonymous) return null
  return user
}
