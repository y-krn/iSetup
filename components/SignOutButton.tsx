'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()

  async function onClick() {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
      aria-label="ログアウト"
      title="ログアウト"
    >
      <LogOut size={16} />
    </button>
  )
}
