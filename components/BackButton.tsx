'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

type Props = { fallback?: string; variant?: 'icon' | 'text' }

export function BackButton({ fallback = '/', variant = 'icon' }: Props) {
  const router = useRouter()
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    setHasHistory(window.history.length > 1)
  }, [])

  function onClick(e: React.MouseEvent) {
    if (hasHistory) {
      e.preventDefault()
      router.back()
    }
  }

  if (variant === 'text') {
    return (
      <Link
        href={fallback}
        onClick={onClick}
        className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        戻る
      </Link>
    )
  }

  return (
    <Link
      href={fallback}
      onClick={onClick}
      className="flex items-center justify-center w-9 h-9 rounded-full glass-soft text-muted hover:text-accent transition-colors"
      aria-label="戻る"
    >
      <ArrowLeft size={18} />
    </Link>
  )
}
