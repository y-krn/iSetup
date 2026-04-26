import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold">ログイン</h1>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        メールアドレス入力 → 受信したリンクをタップでログイン。パスワード不要。
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
