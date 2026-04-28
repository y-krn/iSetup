import { Suspense } from 'react'
import Link from 'next/link'
import { BackButton } from '@/components/BackButton'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <BackButton fallback="/" />
        <h1 className="text-2xl font-bold tracking-tight">ログイン</h1>
      </div>
      <p className="text-sm text-muted leading-relaxed">
        メールアドレス入力 → 受信したリンクをタップでログイン。パスワード不要。
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
