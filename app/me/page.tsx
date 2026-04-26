import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PostGrid } from '@/components/PostGrid'

export const revalidate = 0

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">まだ投稿がありません</p>
        <Link href="/upload" className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm">
          ホーム画面を投稿する
        </Link>
      </div>
    )
  }

  const admin = createAdminClient()
  const { data: posts } = await admin
    .from('posts')
    .select('*')
    .eq('anon_user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">マイページ</h1>
        <span className="text-xs text-gray-400">{posts?.length ?? 0} 件</span>
      </div>
      {posts && posts.length > 0 ? (
        <PostGrid initialPosts={posts} showEdit />
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-gray-500">まだ投稿がありません</p>
          <Link href="/upload" className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm">
            ホーム画面を投稿する
          </Link>
        </div>
      )}
    </div>
  )
}
