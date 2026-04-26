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
      className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-500 transition-colors"
    >
      <Pencil size={14} />
      <span className="text-xs">編集</span>
    </Link>
  )
}
