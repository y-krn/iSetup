'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ImagePlus, SearchX } from 'lucide-react'
import { ensureAnonymousUser } from '@/lib/auth'
import { PostCard } from './PostCard'

type Post = {
  id: string
  image_url: string
  like_count: number
  extracted_tags: Record<string, unknown>
  created_at: string
  anon_user_id: string | null
}

type Props = {
  initialPosts: Post[]
  tag?: string
  theme?: string
  type?: string
  showEdit?: boolean
  emptyTitle?: string
  emptyDescription?: string
  filteredEmptyTitle?: string
  filteredEmptyDescription?: string
  loadingLabel?: string
  locale?: 'ja' | 'en'
}

export function PostGrid({
  initialPosts,
  tag,
  theme,
  type,
  showEdit,
  emptyTitle = 'まだ投稿がありません',
  emptyDescription = '最初のiPhone画面が投稿されると、ここにギャラリーとして並びます。',
  filteredEmptyTitle = '条件に合う投稿がありません',
  filteredEmptyDescription = '別のアプリ、ウィジェット、テーマで探してみてください。',
  loadingLabel = '読み込み中...',
  locale = 'ja',
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<string | null>(
    initialPosts.at(-1)?.created_at ?? null
  )
  const [hasMore, setHasMore] = useState(initialPosts.length === 20)
  const [loading, setLoading] = useState(false)
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchLiked = useCallback(async (ids: string[]) => {
    if (!ids.length) return
    await ensureAnonymousUser()
    const params = new URLSearchParams()
    ids.forEach(id => params.append('id', id))
    const res = await fetch(`/api/likes/bulk?${params}`)
    if (!res.ok) return
    const data: Record<string, boolean> = await res.json()
    setLikedMap(prev => ({ ...prev, ...data }))
  }, [])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return
    setLoading(true)
    const params = new URLSearchParams({ cursor })
    if (tag) params.set('tag', tag)
    if (theme) params.set('theme', theme)
    if (type) params.set('type', type)
    const res = await fetch(`/api/posts?${params}`)
    const data: Post[] = await res.json()
    setPosts(p => [...p, ...data])
    setCursor(data.at(-1)?.created_at ?? null)
    setHasMore(data.length === 20)
    setLoading(false)
    fetchLiked(data.map(p => p.id))
  }, [loading, hasMore, cursor, tag, theme, type, fetchLiked])

  useEffect(() => {
    fetchLiked(initialPosts.map(p => p.id))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [loadMore])

  if (posts.length === 0) {
    return (
      <div className="gallery-shelf rounded-[2.25rem] px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-accent/10 text-accent">
          {tag || theme ? <SearchX size={28} /> : <ImagePlus size={28} />}
        </div>
        <h2 className="mt-5 text-xl font-black">
          {tag || theme ? filteredEmptyTitle : emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {tag || theme ? filteredEmptyDescription : emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6 max-w-md sm:max-w-none mx-auto">
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            priority={i < 3}
            showEdit={showEdit}
            featured={!showEdit && i === 0 && !tag && !theme}
            initialLiked={likedMap[post.id] ?? false}
            locale={locale}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-4" />
      {loading && (
        <div className="text-center py-4 text-gray-400 text-sm">{loadingLabel}</div>
      )}
    </>
  )
}
