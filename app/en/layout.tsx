import type { Metadata } from 'next'
import { AppRoot } from '@/components/AppRoot'
import '../globals.css'

export const metadata: Metadata = {
  title: 'iSetup — Real iPhone setups, decoded',
  description: 'Discover real iPhone home screens and lock screens with apps, widgets, colors, and themes automatically detected.',
  metadataBase: new URL('https://isetup.app'),
  openGraph: {
    title: 'iSetup — Real iPhone setups, decoded',
    description: 'Discover real iPhone home screens and lock screens with apps, widgets, colors, and themes automatically detected.',
    url: '/en',
    siteName: 'iSetup.app',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iSetup — Real iPhone setups, decoded',
    description: 'Discover real iPhone home screens and lock screens with apps, widgets, colors, and themes automatically detected.',
  },
}

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="en">{children}</AppRoot>
}
