// iTunes Search API → App Store URL解決
// Doc: https://performance-partners.apple.com/search-api

export type AppStoreInfo = {
  url: string
  icon: string
  trackName: string
}

const ENDPOINT = 'https://itunes.apple.com/search'

type ITunesItem = {
  trackName: string
  artistName: string
  trackViewUrl: string
  artworkUrl100: string
  sellerName?: string
}

const APPLE_ARTISTS = ['Apple', 'Apple Inc.', 'Apple Inc']

export async function lookupApp(name: string, country = 'jp'): Promise<AppStoreInfo | null> {
  try {
    const params = new URLSearchParams({
      term: name,
      country,
      entity: 'software',
      limit: '5',
    })
    const res = await fetch(`${ENDPOINT}?${params}`, { next: { revalidate: 86400 } })
    if (!res.ok) return null

    const data = await res.json()
    const items: ITunesItem[] = data.results ?? []
    if (items.length === 0) return null

    // Apple純正アプリ優先 → 無ければ1位
    const appleApp = items.find(i =>
      APPLE_ARTISTS.includes(i.artistName) || (i.sellerName && APPLE_ARTISTS.includes(i.sellerName))
    )
    const item = appleApp ?? items[0]

    return {
      url: item.trackViewUrl,
      icon: item.artworkUrl100,
      trackName: item.trackName,
    }
  } catch {
    return null
  }
}

export async function lookupApps(names: string[]): Promise<Record<string, AppStoreInfo>> {
  const results = await Promise.all(names.map(async n => [n, await lookupApp(n)] as const))
  return Object.fromEntries(results.filter(([, v]) => v !== null)) as Record<string, AppStoreInfo>
}

// trackViewUrl ("https://apps.apple.com/jp/app/foo/id12345") → "12345"
export function extractTrackId(url: string): string | null {
  const m = url.match(/\/id(\d+)/)
  return m?.[1] ?? null
}

export async function lookupAppById(id: string, country = 'jp'): Promise<AppStoreInfo | null> {
  try {
    const params = new URLSearchParams({ id, country, entity: 'software' })
    const res = await fetch(`https://itunes.apple.com/lookup?${params}`, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const data = await res.json()
    const item = data.results?.[0]
    if (!item) return null
    return {
      url: item.trackViewUrl,
      icon: item.artworkUrl100,
      trackName: item.trackName,
    }
  } catch {
    return null
  }
}
