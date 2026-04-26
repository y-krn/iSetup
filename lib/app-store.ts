// iTunes Search API → App Store URL解決
// Doc: https://performance-partners.apple.com/search-api

export type AppStoreInfo = {
  url: string
  icon: string
  trackName: string
}

const ENDPOINT = 'https://itunes.apple.com/search'

export async function lookupApp(name: string, country = 'jp'): Promise<AppStoreInfo | null> {
  try {
    const params = new URLSearchParams({
      term: name,
      country,
      entity: 'software',
      limit: '1',
    })
    const res = await fetch(`${ENDPOINT}?${params}`, { next: { revalidate: 86400 } })
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

export async function lookupApps(names: string[]): Promise<Record<string, AppStoreInfo>> {
  const results = await Promise.all(names.map(async n => [n, await lookupApp(n)] as const))
  return Object.fromEntries(results.filter(([, v]) => v !== null)) as Record<string, AppStoreInfo>
}
