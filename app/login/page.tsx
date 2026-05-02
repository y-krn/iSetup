import { Suspense } from 'react'
import { Mail, ShieldCheck } from 'lucide-react'
import { BackButton } from '@/components/BackButton'
import { LoginForm } from '@/components/LoginForm'

type Props = {
  searchParams: Promise<{
    error?: string
    error_code?: string
    error_description?: string
  }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, error_code, error_description } = await searchParams
  const hasAuthError = !!(error || error_code || error_description)
  const authErrorText = error_code === 'otp_expired' || error === 'invalid'
    ? 'ログインリンクの期限が切れています。メールアドレスを入力して、新しいリンクを受け取ってください。'
    : error_description
      ? decodeURIComponent(error_description.replace(/\+/g, ' '))
      : 'ログインに失敗しました。もう一度メールリンクを送信してください。'

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,1fr)] md:items-start">
      <section className="space-y-4">
        <BackButton fallback="/" variant="text" />
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
            <ShieldCheck size={13} />
            Access Pass
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">ログイン</h1>
          <p className="text-sm text-muted leading-relaxed">
            メールに届くリンクから、投稿・編集・マイギャラリーへアクセスできます。パスワードは不要です。
          </p>
        </div>
        {hasAuthError && (
          <div className="rounded-3xl bg-danger/10 p-4 text-sm font-semibold leading-relaxed text-danger">
            {authErrorText}
          </div>
        )}
      </section>

      <section className="gallery-shelf order-3 rounded-[2.25rem] p-4 sm:p-5 md:order-none">
        <div className="phone-frame mx-auto aspect-[9/19.5] max-w-[18rem] rounded-[2.85rem] p-[9px]">
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2.32rem] bg-black p-6 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(94,234,212,0.3),transparent_38%),linear-gradient(145deg,#0b1513,#050606)]" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-white/12 backdrop-blur-md">
              <Mail size={30} />
            </div>
            <div className="relative mt-5 text-xl font-black">Magic Link</div>
            <p className="relative mt-2 max-w-[12rem] text-xs leading-relaxed text-white/65">
              受信したリンクを開くだけでサインインできます。
            </p>
          </div>
        </div>
      </section>

      <section className="gallery-caption order-2 rounded-[2rem] p-5 md:order-none md:col-start-2 md:-mt-48 lg:-mt-56">
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </div>
  )
}
