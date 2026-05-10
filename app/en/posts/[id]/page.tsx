import type { Metadata } from 'next'
import { PostDetail, generatePostMetadata } from '@/app/(ja)/posts/[id]/page'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ posted?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return generatePostMetadata(id, 'en')
}

export default async function EnglishPostPage({ params, searchParams }: Props) {
  const { id } = await params
  const { posted } = await searchParams

  return <PostDetail id={id} posted={posted} locale="en" />
}
