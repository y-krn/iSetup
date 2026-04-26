'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * 匿名サインイン (idempotent)。LikeButton用。
 */
export async function ensureAnonymousUser(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user.id

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) {
    console.error('signInAnonymously failed:', error)
    return null
  }
  return data.user?.id ?? null
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
