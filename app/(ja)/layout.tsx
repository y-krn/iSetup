import type { Metadata } from 'next'
import { AppRoot } from '@/components/AppRoot'
import '../globals.css'

export const metadata: Metadata = {
  title: 'iSetup — iOSホーム画面・ロック画面を共有しよう',
  description: 'iSetup.app — みんなのiOSホーム画面・ロック画面を覗き見。AIが自動でアプリ・ウィジェットを解析。',
  metadataBase: new URL('https://isetup.app'),
  openGraph: {
    title: 'iSetup — iOSホーム画面・ロック画面を共有しよう',
    description: 'みんなのiOSホーム画面・ロック画面を覗き見。AIが自動でアプリ・ウィジェットを解析。',
    url: '/',
    siteName: 'iSetup.app',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iSetup — iOSホーム画面・ロック画面を共有しよう',
    description: 'みんなのiOSホーム画面・ロック画面を覗き見。AIが自動でアプリ・ウィジェットを解析。',
  },
}

export default function JapaneseRootLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="ja">{children}</AppRoot>
}
