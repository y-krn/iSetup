'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { getCurrentUserId } from '@/lib/auth'

type Props = { postId: string; ownerAnonId: string | null; locale?: 'ja' | 'en' }

export function EditButton({ postId, ownerAnonId, locale = 'ja' }: Props) {
  const [isOwner, setIsOwner] = useState(false)
  const editLabel = locale === 'en' ? 'Edit' : '編集'
  const editHref = locale === 'en' ? `/en/posts/${postId}/edit` : `/posts/${postId}/edit`

  useEffect(() => {
    if (!ownerAnonId) return
    getCurrentUserId().then(uid => setIsOwner(uid === ownerAnonId))
  }, [ownerAnonId])

  if (!isOwner) return null

  return (
    <Link
      href={editHref}
      prefetch={false}
      className="gallery-caption flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-accent active:scale-90"
      aria-label={editLabel}
      title={editLabel}
    >
      <Pencil size={14} />
    </Link>
  )
}
