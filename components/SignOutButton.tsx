'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'
import { clearAuthCache } from '@/lib/auth'

export function SignOutButton() {
  const router = useRouter()
  const pathname = usePathname()
  const isEnglish = pathname?.startsWith('/en')
  const [signingOut, setSigningOut] = useState(false)

  async function onClick() {
    if (signingOut) return
    setSigningOut(true)
    clearAuthCache()
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push(isEnglish ? '/en' : '/')
    router.refresh()
  }

  return (
    <button
      onClick={onClick}
      disabled={signingOut}
      className="gallery-caption flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-danger active:scale-90 disabled:opacity-50"
      aria-label={isEnglish ? 'Sign out' : 'ログアウト'}
      title={isEnglish ? 'Sign out' : 'ログアウト'}
    >
      {signingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
    </button>
  )
}
