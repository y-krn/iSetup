'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { ensureAnonymousUser } from '@/lib/auth'

type Props = { postId: string; initialCount: number; initialLiked?: boolean }

export function LikeButton({ postId, initialCount, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked ?? false)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // PostGrid から一括取得済みの場合はスキップ
    if (initialLiked !== undefined) return
    ensureAnonymousUser().then(() => {
      fetch(`/api/likes?postId=${postId}`)
        .then(r => r.json())
        .then(d => setLiked(d.liked))
        .catch(() => {})
    })
  }, [postId, initialLiked])

  async function toggle() {
    if (loading) return
    setError(null)
    const userId = await ensureAnonymousUser()
    if (!userId) {
      setError('失敗')
      return
    }

    setLoading(true)
    const previousLiked = liked
    const previousCount = count
    const optimisticLiked = !liked
    setLiked(optimisticLiked)
    setCount(Math.max(0, count + (optimisticLiked ? 1 : -1)))
    if (optimisticLiked) {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 400)
    }

    try {
      const res = await fetch('/api/likes', {
        method: optimisticLiked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      if (!res.ok) throw new Error('like failed')
    } catch {
      setLiked(previousLiked)
      setCount(previousCount)
      setError('失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggle}
        disabled={loading}
        className="flex items-center gap-1.5 text-sm transition-colors active:scale-90 disabled:opacity-60"
        aria-label="like"
      >
        <Heart
          size={18}
          className={`transition-all ${liked ? 'fill-rose-500 text-rose-500' : 'text-muted'} ${animate ? 'scale-125' : 'scale-100'}`}
        />
        <span className={`text-xs font-medium ${liked ? 'text-rose-500' : 'text-muted'}`}>{count}</span>
      </button>
      {error && <span className="text-[10px] font-semibold text-danger">{error}</span>}
    </div>
  )
}
