'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { ensureAnonymousUser } from '@/lib/auth'

type Props = { postId: string; initialCount: number }

export function LikeButton({ postId, initialCount }: Props) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ensureAnonymousUser().then(() => {
      fetch(`/api/likes?postId=${postId}`)
        .then(r => r.json())
        .then(d => setLiked(d.liked))
    })
  }, [postId])

  async function toggle() {
    if (loading) return
    await ensureAnonymousUser()
    setLoading(true)
    const optimisticLiked = !liked
    setLiked(optimisticLiked)
    setCount(c => c + (optimisticLiked ? 1 : -1))

    await fetch('/api/likes', {
      method: optimisticLiked ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    })
    setLoading(false)
  }

  return (
    <button onClick={toggle} className="flex items-center gap-1 text-sm transition-colors" aria-label="like">
      <Heart
        size={18}
        className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
      />
      <span className={liked ? 'text-red-500' : 'text-gray-400'}>{count}</span>
    </button>
  )
}
