import type { Metadata } from 'next'
import Image from 'next/image'
import { ExternalLink, Images, LayoutGrid, Star } from 'lucide-react'
import { BackButton } from '@/components/BackButton'
import { PostGrid } from '@/components/PostGrid'
import { createAdminClient } from '@/lib/supabase/admin'

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

async function fetchFullInfo(slug: string, country = 'us'): Promise<ITunesItem | null> {
  if (/^\d+$/.test(slug)) {
    const params = new URLSearchParams({ id: slug, country, entity: 'software' })
    const res = await fetch(`https://itunes.apple.com/lookup?${params}`, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const data = await res.json()
    return data.results?.[0] ?? null
  }

  const params = new URLSearchParams({ term: slug, country, entity: 'software', limit: '1' })
  const res = await fetch(`https://itunes.apple.com/search?${params}`, { next: { revalidate: 86400 } })
  if (!res.ok) return null
  const data = await res.json()
  return data.results?.[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const info = await fetchFullInfo(decodedName)
  const appName = info?.trackName ?? decodedName

  return {
    title: `iPhone setups using ${appName} — iSetup`,
    description: `Browse real iPhone home screen and lock screen setups that use ${appName}.`,
    alternates: {
      canonical: `/en/apps/${encodeURIComponent(name)}`,
    },
    openGraph: {
      title: `iPhone setups using ${appName} — iSetup`,
      description: `Browse real iPhone setups that use ${appName}.`,
      url: `/en/apps/${encodeURIComponent(name)}`,
      siteName: 'iSetup.app',
      locale: 'en_US',
      type: 'website',
    },
  }
}

export default async function EnglishAppPage({ params }: Props) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  const [info, supabase] = await Promise.all([
    fetchFullInfo(decodedName),
    Promise.resolve(createAdminClient()),
  ])

  type PostRow = {
    id: string
    image_url: string
    like_count: number
    extracted_tags: Record<string, unknown>
    created_at: string
    anon_user_id: string | null
  }

  let posts: PostRow[] | null = null
  if (/^\d+$/.test(decodedName)) {
    const { data } = await supabase.rpc('posts_by_track_id', { track_id: decodedName })
    posts = (data as PostRow[]) ?? null
  } else {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .or(`extracted_tags->apps.cs.${JSON.stringify([decodedName])},extracted_tags->dock_apps.cs.${JSON.stringify([decodedName])}`)
      .order('created_at', { ascending: false })
      .limit(20)
    posts = data
  }

  const appName = info?.trackName ?? decodedName

  return (
    <div className="space-y-6">
      <BackButton fallback="/en/apps" variant="text" label="Back" />

      {info ? (
        <section className="gallery-shelf overflow-hidden rounded-[2.25rem] p-4 sm:p-5 lg:min-h-[420px]">
          <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
            <div className="relative w-28 sm:w-32">
              <div className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl" />
              <Image
                src={info.artworkUrl512 ?? info.artworkUrl100}
                alt={info.trackName}
                width={128}
                height={128}
                className="relative rounded-[1.75rem] shadow-2xl ring-1 ring-black/5"
                unoptimized
              />
            </div>

            <div className="min-w-0 space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
                  <LayoutGrid size={13} />
                  App Profile
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black leading-tight">{info.trackName}</h1>
                  <p className="mt-1 truncate text-sm font-semibold text-muted">{info.artistName}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {info.primaryGenreName && (
                  <span className="gallery-caption rounded-full px-3 py-1 text-xs font-semibold">{info.primaryGenreName}</span>
                )}
                {info.averageUserRating !== undefined && info.userRatingCount !== undefined && info.userRatingCount > 0 && (
                  <span className="gallery-caption inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {info.averageUserRating.toFixed(1)}
                    <span className="text-muted">({info.userRatingCount.toLocaleString('en-US')})</span>
                  </span>
                )}
                {info.formattedPrice && (
                  <span className="gallery-caption rounded-full px-3 py-1 text-xs font-semibold">{info.formattedPrice}</span>
                )}
              </div>

              {info.description && (
                <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted line-clamp-5">
                  {info.description}
                </p>
              )}

              <a
                href={info.trackViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all hover:bg-accent-strong hover:scale-[1.01] active:scale-95"
              >
                <ExternalLink size={14} />
                Open in App Store
              </a>
            </div>
          </div>

          {info.screenshotUrls && info.screenshotUrls.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.16em]">
                <Images size={14} />
                App Store Screens
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {info.screenshotUrls.slice(0, 5).map((url, i) => (
                  <Image
                    key={url}
                    src={url}
                    alt={`App Store screenshot ${i + 1}`}
                    width={150}
                    height={325}
                    className="flex-shrink-0 rounded-[1.35rem] shadow-lg ring-1 ring-black/5"
                    unoptimized
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="gallery-caption rounded-[2rem] p-8 text-center">
          <h1 className="text-lg font-black">{decodedName}</h1>
          <p className="mt-2 text-sm text-muted">Could not find this app in the App Store.</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.16em]">
          <LayoutGrid size={14} />
          iPhone setups using {appName}
        </h2>
        <PostGrid
          initialPosts={posts ?? []}
          tag={decodedName}
          emptyTitle="No setups yet"
          emptyDescription={`No shared setups using ${appName} yet.`}
          filteredEmptyTitle="No matching setups"
          filteredEmptyDescription="Try another app, widget, or theme."
          loadingLabel="Loading..."
          locale="en"
        />
      </div>
    </div>
  )
}

