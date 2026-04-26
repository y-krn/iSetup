import { createAdminClient } from '@/lib/supabase/admin'
import { PostGrid } from '@/components/PostGrid'
import { lookupApp } from '@/lib/app-store'

type Props = {
  searchParams: Promise<{ tag?: string; theme?: string; type?: string }>
}

export const revalidate = 0

export default async function Home({ searchParams }: Props) {
  const { tag, theme, type } = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (tag) {
    const column = type === 'widget' ? 'widgets' : 'apps'
    query = query.contains(`extracted_tags->${column}`, JSON.stringify([tag]))
  }
  if (theme) query = query.eq('extracted_tags->>theme', theme)

  const { data: posts } = await query

  // タグ正式名解決 (iTunes API)
  const tagInfo = tag ? await lookupApp(tag) : null
  const displayTag = tagInfo?.trackName ?? tag

  return (
    <div className="space-y-4">
      {(tag || theme) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>フィルター:</span>
          {tag && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{displayTag}</span>}
          {theme && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{theme}</span>}
          <a href="/" className="text-gray-400 hover:text-gray-600 text-xs">クリア</a>
        </div>
      )}
      <PostGrid initialPosts={posts ?? []} tag={tag} theme={theme} />
    </div>
  )
}
