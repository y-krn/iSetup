'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type LoginCopy = {
  sentTitle: string
  sentDescription: (email: string) => React.ReactNode
  sentHint: string
  emailPlaceholder: string
  sendingLabel: string
  submitLabel: string
  consent: React.ReactNode
}

const jaCopy: LoginCopy = {
  sentTitle: 'メール送信完了',
  sentDescription: email => (
    <>
      <span className="font-semibold text-foreground">{email}</span> 宛にログインリンクを送信。受信箱を確認してリンクをタップ。
    </>
  ),
  sentHint: '届かない場合は迷惑メールフォルダを確認。',
  emailPlaceholder: 'メールアドレス',
  sendingLabel: '送信中...',
  submitLabel: 'ログインリンクを送る',
  consent: (
    <>
      ログインすることで <a href="/terms" className="underline hover:text-accent">利用規約</a> と <a href="/privacy" className="underline hover:text-accent">プライバシーポリシー</a> に同意したものとみなされます。
    </>
  ),
}

const enCopy: LoginCopy = {
  sentTitle: 'Check your inbox',
  sentDescription: email => (
    <>
      We sent a magic link to <span className="font-semibold text-foreground">{email}</span>. Open it to continue.
    </>
  ),
  sentHint: 'If it does not arrive, check your spam folder.',
  emailPlaceholder: 'Email address',
  sendingLabel: 'Sending...',
  submitLabel: 'Send login link',
  consent: (
    <>
      By logging in, you agree to the <a href="/en/terms" className="underline hover:text-accent">Terms</a> and <a href="/en/privacy" className="underline hover:text-accent">Privacy Policy</a>.
    </>
  ),
}

type Props = { nextOverride?: string; locale?: 'ja' | 'en' }

export function LoginForm({ nextOverride, locale = 'ja' }: Props = {}) {
  const searchParams = useSearchParams()
  const next = nextOverride ?? searchParams.get('next') ?? (locale === 'en' ? '/en' : '/me')
  const copy = locale === 'en' ? enCopy : jaCopy

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
      <div className="gallery-caption rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle2 size={20} />
          <span className="font-bold">{copy.sentTitle}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          {copy.sentDescription(email)}
        </p>
        <p className="text-xs text-muted">
          {copy.sentHint}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10" />
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={copy.emailPlaceholder}
          className="w-full pl-11 pr-4 h-12 rounded-full gallery-caption text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/35 transition-shadow"
        />
      </div>
      {error && <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      <button
        type="submit"
        disabled={!email.trim() || sending}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-full text-sm font-semibold text-white bg-accent shadow-lg shadow-emerald-950/10 hover:bg-accent-strong hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Send size={14} />
        {sending ? copy.sendingLabel : copy.submitLabel}
      </button>
      <p className="text-[11px] text-muted text-center leading-relaxed">
        {copy.consent}
      </p>
    </form>
  )
}
