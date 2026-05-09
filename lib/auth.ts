'use client'

import { createClient } from '@/lib/supabase/client'

let cached: Promise<string | null> | null = null

/**
 * 匿名サインイン (idempotent + race-safe)。LikeButton用。
 * 並列呼出は同一 Promise を共有 → signup 1回のみ。
 */
export async function ensureAnonymousUser(): Promise<string | null> {
  if (cached) return cached
  cached = (async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user.id
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('signInAnonymously failed:', error)
      return null
    }
    return data.user?.id ?? null
  })()
  const result = await cached
  if (result === null) cached = null
  return result
}

/**
 * サインアウト時にキャッシュをクリア。
 * 同一タブで別ユーザーが使い始めても旧IDを引かないようにする。
 */
export function clearAuthCache() {
  cached = null
}

/**
 * 現在のuser.id取得 (clientのみ)。未認証なら null。
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

/**
 * 匿名でない (Magic Linkでログイン済) ユーザーか
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.is_anonymous) return null
  return user.id
}
