'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * 匿名サインイン (idempotent)。既存セッションあれば user.id 返す。
 */
export async function ensureAnonymousUser(): Promise<string | null> {
  const supabase = createClient()

  // 既存セッション確認
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user.id

  // 匿名サインイン
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) {
    console.error('signInAnonymously failed:', error)
    return null
  }
  return data.user?.id ?? null
}

/**
 * 現在のuser.id取得 (clientのみ・非同期)。未認証なら null。
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}
