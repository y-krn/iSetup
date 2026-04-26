import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const params = new URLSearchParams({
    term: name,
    country: 'jp',
    entity: 'software',
    limit: '10',
  })

  try {
    const res = await fetch(`https://itunes.apple.com/search?${params}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return NextResponse.json([])

    const data = await res.json()
    type ITunesItem = {
      trackName: string
      artistName: string
      trackViewUrl: string
      artworkUrl100: string
    }
    const items: ITunesItem[] = data.results ?? []

    const candidates = items.map(i => ({
      trackName: i.trackName,
      artistName: i.artistName,
      url: i.trackViewUrl,
      icon: i.artworkUrl100,
    }))

    return NextResponse.json(candidates)
  } catch {
    return NextResponse.json([])
  }
}
