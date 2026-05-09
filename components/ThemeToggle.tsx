'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const isEnglish = pathname?.startsWith('/en')

  const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  const label = isEnglish
    ? theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'
    : theme === 'light' ? 'ライト' : theme === 'dark' ? 'ダーク' : 'システム'

  return (
    <button
      onClick={() => setTheme(next)}
      className="gallery-caption flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-accent active:scale-90"
      title={isEnglish ? `Theme: ${label}` : `テーマ: ${label}`}
      aria-label={isEnglish ? `Change theme (current: ${label})` : `テーマ切替 (現在: ${label})`}
    >
      <Icon size={16} />
    </button>
  )
}
