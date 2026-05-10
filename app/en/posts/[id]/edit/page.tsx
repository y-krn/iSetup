import type { Metadata } from 'next'
import { EditPostContent } from '@/app/(ja)/posts/[id]/edit/page'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = {
  title: 'Edit setup — iSetup',
  robots: {
    index: false,
    follow: false,
  },
}

export default function EnglishEditPostPage({ params }: Props) {
  return <EditPostContent params={params} locale="en" />
}
