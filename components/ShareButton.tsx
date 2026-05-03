'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

type Props = {
  title: string
  text: string
}

export function ShareButton({ title, text }: Props) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  async function onShare() {
    if (sharing) return
    setSharing(true)
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          // 共有・コピーともに失敗した場合は、UIを現在状態のまま戻す。
        }
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      disabled={sharing}
      className="gallery-caption inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-bold text-muted transition-all hover:-translate-y-0.5 hover:text-accent active:scale-95 disabled:opacity-60"
      aria-label="投稿を共有"
      title="投稿を共有"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? 'コピー済み' : '共有'}
    </button>
  )
}
