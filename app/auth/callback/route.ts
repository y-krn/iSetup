import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getRequestOrigin(req: NextRequest) {
  const host = req.headers.get('host')
  if (!host) return new URL(req.url).origin

  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const hostname = host.replace(/^\[/, '').replace(/\].*$/, '').split(':')[0]
  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  const protocol = isLocalHost
    ? forwardedProto === 'https' ? 'https' : 'http'
    : 'https'

  return `${protocol}://${host}`
}

function getSafeNext(searchParams: URLSearchParams) {
  const next = searchParams.get('next') ?? '/me'
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return '/me'
  return next
}

function isEnglishPath(path: string) {
  return path === '/en' || path.startsWith('/en/')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = getRequestOrigin(req)
  const code = searchParams.get('code')
  const next = getSafeNext(searchParams)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  const loginPath = isEnglishPath(next) ? '/en/login' : '/login'
  const loginUrl = new URL(loginPath, origin)
  loginUrl.searchParams.set('error', 'invalid')
  loginUrl.searchParams.set('next', next)

  return NextResponse.redirect(loginUrl)
}
