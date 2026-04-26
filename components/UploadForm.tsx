'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Upload, ImageIcon } from 'lucide-react'

export function UploadForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('画像ファイルを選択してください'); return }
    if (f.size > 10 * 1024 * 1024) { setError('10MB以下の画像を選択してください'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/posts', { method: 'POST', body: formData })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'アップロードに失敗しました')
      setUploading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
        style={{ minHeight: 320 }}
      >
        {preview ? (
          <div className="relative w-full" style={{ aspectRatio: '9/19.5' }}>
            <Image src={preview} alt="preview" fill sizes="(max-width: 640px) 100vw, 384px" className="object-contain rounded-2xl" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
            <ImageIcon size={48} strokeWidth={1} />
            <p className="text-sm">スクリーンショットを選択</p>
            <p className="text-xs">PNG / JPG・10MB以下</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={!file || uploading} className="w-full gap-2">
        <Upload size={16} />
        {uploading ? 'AI解析・圧縮中...' : '投稿する'}
      </Button>
    </form>
  )
}
