'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { getCurrentUserId } from '@/lib/auth'

type Props = { postId: string; ownerAnonId: string | null }

export function EditButton({ postId, ownerAnonId }: Props) {
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (!ownerAnonId) return
    getCurrentUserId().then(uid => setIsOwner(uid === ownerAnonId))
  }, [ownerAnonId])

  if (!isOwner) return null

  return (
    <Link
      href={`/posts/${postId}/edit`}
      prefetch={false}
      className="gallery-caption flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-accent active:scale-90"
      aria-label="編集"
      title="編集"
    >
      <Pencil size={14} />
    </Link>
  )
}
