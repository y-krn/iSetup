import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PostGrid } from '@/components/PostGrid'

export const revalidate = 0

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export default async function MyPage({ searchParams }: Props) {
  const { tab } = await searchParams
  const activeTab = tab === 'liked' ? 'liked' : 'mine'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">ログインしていません</p>
        <Link href="/upload" className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm">
          ホーム画面を投稿する
        </Link>
      </div>
    )
  }

  const admin = createAdminClient()

  let posts: unknown[] = []
  if (activeTab === 'mine') {
    const { data } = await admin
      .from('posts')
      .select('*')
      .eq('anon_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    posts = data ?? []
  } else {
    // いいねした投稿: likes JOIN posts
    const { data } = await admin
      .from('likes')
      .select('post_id, created_at, posts(*)')
      .eq('anon_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    posts = (data ?? []).map((l: { posts: unknown }) => l.posts).filter(Boolean)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">マイページ</h1>

      <div className="flex gap-1 border-b border-gray-200">
        <Link
          href="/me"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'mine'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          自分の投稿
        </Link>
        <Link
          href="/me?tab=liked"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'liked'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          いいね
        </Link>
      </div>

      {posts.length > 0 ? (
        <PostGrid initialPosts={posts as never} showEdit={activeTab === 'mine'} />
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-gray-500">
            {activeTab === 'mine' ? 'まだ投稿がありません' : 'まだいいねがありません'}
          </p>
          {activeTab === 'mine' && (
            <Link href="/upload" className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm">
              ホーム画面を投稿する
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
