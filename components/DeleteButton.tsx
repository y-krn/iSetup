'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { getCurrentUserId } from '@/lib/auth'

type Props = { postId: string; ownerAnonId: string | null; redirectAfter?: string }

export function DeleteButton({ postId, ownerAnonId, redirectAfter }: Props) {
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!ownerAnonId) return
    getCurrentUserId().then(uid => setIsOwner(uid === ownerAnonId))
  }, [ownerAnonId])

  if (!isOwner) return null

  async function onDelete() {
    if (!confirm('削除しますか？取消不可。')) return
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

  return (
    <button
      onClick={onDelete}
      disabled={deleting}
      className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      aria-label="delete"
    >
      <Trash2 size={16} />
      <span className="text-xs">{deleting ? '削除中...' : '削除'}</span>
    </button>
  )
}
