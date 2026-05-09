import type { MetadataRoute } from 'next'

const SITE_URL = 'https://isetup.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/login',
        '/me',
        '/upload',
        '/en/login',
        '/en/upload',
        '/posts/*/edit',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

