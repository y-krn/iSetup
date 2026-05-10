import type { Metadata } from 'next'
import { MyPageContent } from '@/app/(ja)/me/page'

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export const metadata: Metadata = {
  title: 'My page — iSetup',
  description: 'Review your shared iPhone setups and the screens you liked.',
  alternates: {
    canonical: '/en/me',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function EnglishMyPage({ searchParams }: Props) {
  return <MyPageContent searchParams={searchParams} locale="en" />
}
