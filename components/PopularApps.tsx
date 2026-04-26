import Image from 'next/image'
import Link from 'next/link'

type AppInfo = { url: string; icon: string; trackName: string }
type PopularApp = { name: string; use_count: number; info: AppInfo | null }

type Props = { apps: PopularApp[] }

function extractTrackId(url: string): string | null {
  const m = url.match(/\/id(\d+)/)
  return m?.[1] ?? null
}

export function PopularApps({ apps }: Props) {
  if (!apps || apps.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700 px-1">人気のアプリ</h2>
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory scrollbar-hide">
        {apps.map(app => {
          const slug = app.info ? (extractTrackId(app.info.url) ?? app.info.trackName) : app.name
          const display = app.info?.trackName ?? app.name
          return (
            <Link
              key={app.name}
              href={`/apps/${encodeURIComponent(slug)}`}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16 snap-start"
            >
              {app.info?.icon ? (
                <Image
                  src={app.info.icon}
                  alt={display}
                  width={56}
                  height={56}
                  className="rounded-2xl shadow-sm ring-1 ring-black/5"
                  unoptimized
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                  ?
                </div>
              )}
              <div className="text-[10px] text-center text-gray-700 leading-tight line-clamp-2 w-full">
                {display}
              </div>
              <div className="text-[9px] text-gray-400">{app.use_count}件</div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
