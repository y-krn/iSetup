import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Trophy } from 'lucide-react'
import { extractTrackId } from '@/lib/app-store'
import { getPopularApps } from '@/lib/popular-apps'

export const revalidate = 0

export default async function AppsPage() {
  const apps = await getPopularApps(60)

  return (
    <div className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          <Trophy size={13} />
          App Index
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">人気のアプリ</h1>
          <p className="max-w-xl text-sm text-muted leading-relaxed">
            みんなのホーム画面でよく使われているアプリを、投稿数順に並べています。
          </p>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="gallery-caption rounded-[2rem] py-20 text-center text-muted">まだデータがありません</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {apps.map((app, i) => {
            const slug = app.info ? (extractTrackId(app.info.url) ?? app.info.trackName) : app.name
            const display = app.info?.trackName ?? app.name
            const featured = i < 3
            return (
              <li key={app.name} className={featured ? 'lg:col-span-1' : ''}>
                <Link
                  href={`/apps/${encodeURIComponent(slug)}`}
                  prefetch={false}
                  className={`group flex h-full items-center gap-3 rounded-[1.75rem] p-3 transition duration-300 hover:-translate-y-1 active:scale-[0.98] ${
                    featured ? 'gallery-shelf' : 'gallery-caption'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {app.info?.icon ? (
                      <Image
                        src={app.info.icon}
                        alt={display}
                        width={featured ? 58 : 50}
                        height={featured ? 58 : 50}
                        className="rounded-[1.05rem] shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[1.05rem] bg-white/30 text-xs text-muted">?</div>
                    )}
                    <span className={`absolute -left-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] font-black shadow-sm ${
                      featured ? 'bg-accent text-white' : 'gallery-caption text-muted'
                    }`}>
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black">{display}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted">
                      <Sparkles size={12} />
                      {app.use_count}件の投稿
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
