import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Star } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { lookupApp } from '@/lib/app-store'
import { PostGrid } from '@/components/PostGrid'

type Props = { params: Promise<{ name: string }> }

type ITunesItem = {
  trackName: string
  artistName: string
  trackViewUrl: string
  artworkUrl512?: string
  artworkUrl100: string
  description?: string
  averageUserRating?: number
  userRatingCount?: number
  genres?: string[]
  formattedPrice?: string
  screenshotUrls?: string[]
  primaryGenreName?: string
}

async function fetchFullInfo(name: string, country = 'jp'): Promise<ITunesItem | null> {
  const params = new URLSearchParams({ term: name, country, entity: 'software', limit: '1' })
  const res = await fetch(`https://itunes.apple.com/search?${params}`, { next: { revalidate: 86400 } })
  if (!res.ok) return null
  const data = await res.json()
  return data.results?.[0] ?? null
}

export default async function AppPage({ params }: Props) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  const [info, supabase] = await Promise.all([
    fetchFullInfo(decodedName),
    Promise.resolve(createAdminClient()),
  ])

  // 該当アプリ含む投稿取得
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .or(`extracted_tags->apps.cs.${JSON.stringify([decodedName])},extracted_tags->dock_apps.cs.${JSON.stringify([decodedName])}`)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm">
        <ArrowLeft size={16} />
        戻る
      </Link>

      {info ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-start gap-4">
            <Image
              src={info.artworkUrl512 ?? info.artworkUrl100}
              alt={info.trackName}
              width={96}
              height={96}
              className="rounded-2xl shadow-md"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-lg leading-tight">{info.trackName}</h1>
              <p className="text-sm text-gray-500 truncate">{info.artistName}</p>
              {info.primaryGenreName && (
                <p className="text-xs text-gray-400 mt-1">{info.primaryGenreName}</p>
              )}
              {info.averageUserRating !== undefined && info.userRatingCount !== undefined && info.userRatingCount > 0 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span>{info.averageUserRating.toFixed(1)}</span>
                  <span className="text-gray-400">({info.userRatingCount.toLocaleString()})</span>
                </div>
              )}
            </div>
          </div>

          <a
            href={info.trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            <ExternalLink size={14} />
            App Storeで開く
            {info.formattedPrice && <span className="text-blue-200">· {info.formattedPrice}</span>}
          </a>

          {info.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-6 whitespace-pre-line">
              {info.description}
            </p>
          )}

          {info.screenshotUrls && info.screenshotUrls.length > 0 && (
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2">
              {info.screenshotUrls.slice(0, 5).map((url, i) => (
                <Image
                  key={url}
                  src={url}
                  alt={`screenshot ${i + 1}`}
                  width={150}
                  height={325}
                  className="rounded-xl shadow-sm flex-shrink-0"
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center text-gray-400">
          <h1 className="text-lg font-semibold text-gray-700 mb-2">{decodedName}</h1>
          <p className="text-sm">App Storeで見つかりませんでした</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">{info?.trackName ?? decodedName} を使った投稿</h2>
        <PostGrid initialPosts={posts ?? []} tag={decodedName} />
      </div>
    </div>
  )
}
