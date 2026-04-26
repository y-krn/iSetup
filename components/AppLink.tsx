import Image from 'next/image'
import Link from 'next/link'

type AppInfo = { url: string; icon: string; trackName: string }

type Props = { name: string; info?: AppInfo }

function extractTrackId(url: string): string | null {
  const m = url.match(/\/id(\d+)/)
  return m?.[1] ?? null
}

export function AppLink({ name, info }: Props) {
  // app_links に URL あれば trackId 優先 (正確マッチ)、無ければ名前検索
  const slug = info ? (extractTrackId(info.url) ?? info.trackName) : name

  return (
    <Link
      href={`/apps/${encodeURIComponent(slug)}`}
      className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
    >
      {info && (
        <Image
          src={info.icon}
          alt={info.trackName}
          width={20}
          height={20}
          className="rounded-md"
          unoptimized
        />
      )}
      <span>{info?.trackName ?? name}</span>
    </Link>
  )
}
