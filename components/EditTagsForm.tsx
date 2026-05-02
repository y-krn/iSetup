'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, Search, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getCurrentUserId } from '@/lib/auth'

type AppInfo = { url: string; icon: string; trackName: string }
type Candidate = { trackName: string; artistName: string; url: string; icon: string }

type Props = {
  postId: string
  ownerAnonId: string | null
  initialApps: string[]
  initialDockApps: string[]
  initialWidgets: string[]
  initialTheme: string
  appLinks: Record<string, AppInfo>
  widgetLinks: Record<string, AppInfo>
}

function ListEditor({
  label,
  items,
  setItems,
  placeholder,
  links,
  setLinks,
}: {
  label: string
  items: string[]
  setItems: (v: string[]) => void
  placeholder: string
  links: Record<string, AppInfo>
  setLinks: (v: Record<string, AppInfo>) => void
}) {
  const [input, setInput] = useState('')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [composing, setComposing] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 入力デバウンス → 候補取得
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!input.trim()) {
      setCandidates([])
      setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/app-candidates?name=${encodeURIComponent(input.trim())}`)
        const data: Candidate[] = await res.json()
        setCandidates(data)
      } catch {
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input])

  // 外クリックでドロップダウン閉じる
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function addCandidate(c: Candidate) {
    if (!items.includes(c.trackName)) {
      setItems([...items, c.trackName])
      setLinks({ ...links, [c.trackName]: { url: c.url, icon: c.icon, trackName: c.trackName } })
    }
    setInput('')
    setCandidates([])
    setShowDropdown(false)
  }

  function remove(i: number) {
    const removed = items[i]
    const next = items.filter((_, idx) => idx !== i)
    setItems(next)
    if (!next.includes(removed)) {
      const newLinks = { ...links }
      delete newLinks[removed]
      setLinks(newLinks)
    }
  }

  return (
    <section className={`gallery-caption rounded-[2rem] p-4 sm:p-5 space-y-3 ${showDropdown && input.trim() ? 'relative z-50' : ''}`}>
      <h2 className="text-xs font-bold text-muted uppercase tracking-[0.16em]">{label}</h2>
      <div className="flex flex-wrap gap-2 min-h-9">
        {items.map((item, i) => {
          const display = links[item]?.trackName ?? item
          return (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-2 gallery-caption pl-1 pr-1 py-1 rounded-full text-xs shadow-sm transition-transform hover:-translate-y-0.5"
              title={item}
            >
              {links[item]?.icon ? (
                <Image src={links[item].icon} alt="" width={22} height={22} className="rounded-md shadow-sm" unoptimized />
              ) : (
                <span className="w-[22px] h-[22px] rounded-md bg-white/40 flex items-center justify-center text-[8px] text-muted">?</span>
              )}
              <span className="max-w-[180px] truncate font-semibold text-foreground">{display}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-7 h-7 -my-1 rounded-full hover:bg-danger/10 active:bg-danger/15 flex items-center justify-center text-muted hover:text-danger transition-colors"
                aria-label="削除"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </span>
          )
        })}
      </div>
      <div ref={containerRef} className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <Input
          value={input}
          onChange={e => { setInput(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onKeyDown={e => {
            // IME変換中のEnterは無視 (e.nativeEvent.isComposing は確実)
            if (e.key === 'Enter') {
              e.preventDefault()
              if (composing || e.nativeEvent.isComposing) return
              // 候補1件のみなら自動選択
              if (candidates.length === 1) addCandidate(candidates[0])
            }
          }}
          placeholder={placeholder}
          className="h-11 text-sm pl-9 rounded-full gallery-caption border-0 bg-transparent"
        />
        {showDropdown && input.trim() && (
          <div className="absolute z-[60] left-0 right-0 mt-2 rounded-3xl gallery-shelf shadow-2xl max-h-80 overflow-y-auto overscroll-contain">
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted px-4 py-4">
                <Loader2 size={14} className="animate-spin" />
                検索中...
              </div>
            )}
            {!loading && candidates.length === 0 && (
              <div className="text-xs text-muted px-4 py-6 text-center">候補なし</div>
            )}
            {!loading && candidates.length > 0 && (
              <ul className="py-1">
                {candidates.map((c, i) => (
                  <li key={c.url}>
                    <button
                      type="button"
                      onClick={() => addCandidate(c)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-white/35 active:bg-white/45 text-left transition-colors"
                    >
                      <Image
                        src={c.icon}
                        alt={c.trackName}
                        width={44}
                        height={44}
                        className="rounded-xl flex-shrink-0 shadow-sm ring-1 ring-black/5"
                        unoptimized
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground truncate">{c.trackName}</div>
                        <div className="text-xs text-muted truncate mt-0.5">{c.artistName}</div>
                      </div>
                    </button>
                    {i < candidates.length - 1 && <div className="ml-[68px] border-t border-black/5 dark:border-white/10" />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export function EditTagsForm({
  postId,
  ownerAnonId,
  initialApps,
  initialDockApps,
  initialWidgets,
  initialTheme,
  appLinks: initialAppLinks,
  widgetLinks: initialWidgetLinks,
}: Props) {
  const [apps, setApps] = useState(initialApps)
  const [dockApps, setDockApps] = useState(initialDockApps)
  const [widgets, setWidgets] = useState(initialWidgets)
  const [theme, setTheme] = useState(initialTheme)
  const [appLinks, setAppLinks] = useState(initialAppLinks)
  const [widgetLinks, setWidgetLinks] = useState(initialWidgetLinks)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    getCurrentUserId().then(uid => setAuthorized(uid === ownerAnonId))
  }, [ownerAnonId])

  if (authorized === null) {
    return (
      <div className="gallery-caption rounded-[2rem] p-6 text-sm text-muted">
        権限を確認しています...
      </div>
    )
  }
  if (!authorized) return <p className="gallery-caption rounded-[2rem] p-5 text-sm font-semibold text-danger">編集権限なし</p>

  async function onSave() {
    setSaving(true)
    setError(null)
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apps,
        dock_apps: dockApps,
        widgets,
        theme,
        app_links: appLinks,
        widget_links: widgetLinks,
      }),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? '保存失敗')
      setSaving(false)
      return
    }
    router.push(`/posts/${postId}`)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <ListEditor label="アプリ" items={apps} setItems={setApps} placeholder="アプリ名で検索して追加" links={appLinks} setLinks={setAppLinks} />
      <ListEditor label="Dock" items={dockApps} setItems={setDockApps} placeholder="Dockアプリを検索して追加" links={appLinks} setLinks={setAppLinks} />
      <ListEditor label="ウィジェット" items={widgets} setItems={setWidgets} placeholder="ウィジェットの提供アプリを検索" links={widgetLinks} setLinks={setWidgetLinks} />

      <section className="gallery-caption rounded-[2rem] p-4 sm:p-5 space-y-3">
        <h2 className="text-xs font-bold text-muted uppercase tracking-[0.16em]">テーマ</h2>
        <div className="flex flex-wrap gap-2">
          {(['dark', 'light', ''] as const).map(t => (
            <button
              key={t || 'none'}
              type="button"
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                theme === t ? 'bg-accent text-white shadow-md' : 'gallery-caption text-muted hover:text-foreground'
              }`}
            >
              {t || '未指定'}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-full text-sm font-semibold text-white bg-accent shadow-lg shadow-emerald-950/10 hover:bg-accent-strong hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? '保存中...' : '保存'}
      </button>
    </div>
  )
}
