'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, X } from 'lucide-react'
import { getCurrentUserId } from '@/lib/auth'

type Props = { postId: string; ownerAnonId: string | null; redirectAfter?: string }

export function DeleteButton({ postId, ownerAnonId, redirectAfter }: Props) {
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!ownerAnonId) return
    getCurrentUserId().then(uid => setIsOwner(uid === ownerAnonId))
  }, [ownerAnonId])

  if (!isOwner) return null

  async function onDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setDeleting(true)
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('削除失敗')
      setDeleting(false)
      return
    }
    if (redirectAfter) {
      router.push(redirectAfter)
      router.refresh()
    } else {
      router.refresh()
    }
  }

  if (confirming) {
    return (
      <div className="gallery-caption flex items-center gap-1 rounded-full p-1">
        <button
          onClick={onDelete}
          disabled={deleting}
          className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-danger px-3 text-xs font-bold text-white transition-all hover:brightness-95 active:scale-95 disabled:opacity-50"
          aria-label="削除を確定"
          title="削除を確定"
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          削除
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/40 hover:text-foreground disabled:opacity-50"
          aria-label="キャンセル"
          title="キャンセル"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={onDelete}
      disabled={deleting}
      className="gallery-caption flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-danger active:scale-90 disabled:opacity-50"
      aria-label="削除"
      title="削除"
    >
      {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  )
}
