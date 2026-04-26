import Image from 'next/image'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

type AppInfo = { url: string; icon: string; trackName: string }
type PopularApp = { name: string; use_count: number; info: AppInfo | null }

export const revalidate = 0

function extractTrackId(url: string): string | null {
  const m = url.match(/\/id(\d+)/)
  return m?.[1] ?? null
}

export default async function AppsPage() {
  const supabase = createAdminClient()
  const { data } = await supabase.rpc('popular_apps', { limit_count: 60 })
  const apps: PopularApp[] = data ?? []

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">人気のアプリ</h1>
      <p className="text-xs text-gray-500">投稿で多く使われているアプリ順</p>

      {apps.length === 0 ? (
        <div className="text-center py-20 text-gray-400">まだデータがありません</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {apps.map((app, i) => {
            const slug = app.info ? (extractTrackId(app.info.url) ?? app.info.trackName) : app.name
            const display = app.info?.trackName ?? app.name
            return (
              <li key={app.name}>
                <Link
                  href={`/apps/${encodeURIComponent(slug)}`}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-400 w-6 text-center">{i + 1}</span>
                  {app.info?.icon ? (
                    <Image
                      src={app.info.icon}
                      alt={display}
                      width={44}
                      height={44}
                      className="rounded-xl flex-shrink-0 shadow-sm ring-1 ring-black/5"
                      unoptimized
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">?</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{display}</div>
                    <div className="text-xs text-gray-400">{app.use_count}件の投稿</div>
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
