import { UploadForm } from '@/components/UploadForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold">ホーム画面を投稿</h1>
      </div>
      <p className="text-sm text-gray-500">
        スクリーンショットをアップロードするとAIが自動でアプリ名・ウィジェット・テーマを解析します。
      </p>
      <UploadForm />
    </div>
  )
}
