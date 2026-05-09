import type { MetadataRoute } from 'next'
import { extractTrackId } from '@/lib/app-store'
import { getPopularApps } from '@/lib/popular-apps'
import { createAdminClient } from '@/lib/supabase/admin'

const SITE_URL = 'https://isetup.app'

type SitemapEntry = MetadataRoute.Sitemap[number]
type PostSitemapRow = {
  id: string
  created_at: string
}

export const revalidate = 3600

function absolute(path: string) {
  return `${SITE_URL}${path}`
}

function localizedEntry(
  path: string,
  enPath: string,
  options: Pick<SitemapEntry, 'lastModified' | 'changeFrequency' | 'priority'>,
): SitemapEntry {
  return {
    url: absolute(path),
    ...options,
    alternates: {
      languages: {
        'ja-JP': absolute(path),
        en: absolute(enPath),
      },
    },
  }
}

async function getPostEntries(): Promise<SitemapEntry[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('posts')
    .select('id,created_at')
    .order('created_at', { ascending: false })
    .limit(5000)

  if (error || !data) return []

  return (data as PostSitemapRow[]).flatMap(post => {
    const lastModified = new Date(post.created_at)

    return [
      {
        ...localizedEntry(`/posts/${post.id}`, `/en/posts/${post.id}`, {
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.7,
        }),
      },
      {
        url: absolute(`/en/posts/${post.id}`),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            'ja-JP': absolute(`/posts/${post.id}`),
            en: absolute(`/en/posts/${post.id}`),
          },
        },
      },
    ] satisfies SitemapEntry[]
  })
}

async function getAppEntries(): Promise<SitemapEntry[]> {
  const apps = await getPopularApps(200)
  const seen = new Set<string>()

  return apps.flatMap(app => {
    const slug = app.info ? (extractTrackId(app.info.url) ?? app.info.trackName) : app.name
    if (!slug || seen.has(slug)) return []
    seen.add(slug)

    const encodedSlug = encodeURIComponent(slug)
    const jaPath = `/apps/${encodedSlug}`
    const enPath = `/en/apps/${encodedSlug}`

    return [
      localizedEntry(jaPath, enPath, {
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }),
      {
        url: absolute(enPath),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: {
            'ja-JP': absolute(jaPath),
            en: absolute(enPath),
          },
        },
      },
    ] satisfies SitemapEntry[]
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries: SitemapEntry[] = [
    localizedEntry('/', '/en', {
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    }),
    {
      url: absolute('/en'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          'ja-JP': absolute('/'),
          en: absolute('/en'),
        },
      },
    },
    localizedEntry('/apps', '/en/apps', {
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    }),
    {
      url: absolute('/en/apps'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          'ja-JP': absolute('/apps'),
          en: absolute('/en/apps'),
        },
      },
    },
    localizedEntry('/terms', '/en/terms', {
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    }),
    {
      url: absolute('/en/terms'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'ja-JP': absolute('/terms'),
          en: absolute('/en/terms'),
        },
      },
    },
    localizedEntry('/privacy', '/en/privacy', {
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    }),
    {
      url: absolute('/en/privacy'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'ja-JP': absolute('/privacy'),
          en: absolute('/en/privacy'),
        },
      },
    },
  ]

  try {
    const [postEntries, appEntries] = await Promise.all([
      getPostEntries(),
      getAppEntries(),
    ])

    return [...staticEntries, ...postEntries, ...appEntries]
  } catch (error) {
    console.error('sitemap generation failed:', error)
    return staticEntries
  }
}
