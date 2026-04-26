'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/me'

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    setError(null)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })

    setSending(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-4 space-y-2">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle2 size={18} />
          <span className="font-semibold text-sm">メール送信完了</span>
        </div>
        <p className="text-xs text-green-900 leading-relaxed">
          {email} 宛にログインリンクを送信しました。受信箱を確認してリンクをタップしてください。
        </p>
        <p className="text-[10px] text-green-700">
          メールが届かない場合は迷惑メールフォルダを確認。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="pl-9 h-11"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <Button type="submit" disabled={!email.trim() || sending} className="w-full gap-2 h-11">
        <Send size={14} />
        {sending ? '送信中...' : 'ログインリンクを送る'}
      </Button>
    </form>
  )
}
