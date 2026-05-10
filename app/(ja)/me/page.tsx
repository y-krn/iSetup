import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Grid2X2, Heart, ImagePlus, UserRound } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAuthenticatedUser } from '@/lib/auth-server'
import { PostGrid } from '@/components/PostGrid'

export const revalidate = 0
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

type Props = {
  searchParams: Promise<{ tab?: string }>
}

type Locale = 'ja' | 'en'

const copy = {
  ja: {
    loginPath: '/login?next=/me',
    pageHref: '/me',
    likedHref: '/me?tab=liked',
    uploadHref: '/upload',
    eyebrow: 'My Gallery',
    title: 'マイページ',
    description: '自分の投稿と、あとで見返したいiPhone画面をまとめて確認できます。',
    mineTab: '自分の投稿',
    likedTab: 'いいね',
    emptyMineTitle: 'まだ投稿がありません',
    emptyLikedTitle: 'まだいいねがありません',
    emptyMineDescription: 'お気に入りのホーム画面やロック画面を投稿すると、ここに自分だけのギャラリーが育っていきます。',
    emptyLikedDescription: '気になるセットアップにハートを付けると、ここからすぐ見返せます。',
    uploadLabel: 'iPhone画面を投稿する',
    gridEmptyTitle: 'まだ投稿がありません',
    gridEmptyDescription: '最初のiPhone画面が投稿されると、ここにギャラリーとして並びます。',
    filteredEmptyTitle: '条件に合う投稿がありません',
    filteredEmptyDescription: '別のアプリ、ウィジェット、テーマで探してみてください。',
    loadingLabel: '読み込み中...',
  },
  en: {
    loginPath: '/en/login?next=/en/me',
    pageHref: '/en/me',
    likedHref: '/en/me?tab=liked',
    uploadHref: '/en/upload',
    eyebrow: 'My Gallery',
    title: 'My page',
    description: 'Review your shared iPhone setups and the screens you liked.',
    mineTab: 'My posts',
    likedTab: 'Liked',
    emptyMineTitle: 'No posts yet',
    emptyLikedTitle: 'No likes yet',
    emptyMineDescription: 'Share your favorite home screen or lock screen to start building your personal gallery.',
    emptyLikedDescription: 'Tap the heart on setups you want to revisit, and they will appear here.',
    uploadLabel: 'Share an iPhone setup',
    gridEmptyTitle: 'No posts yet',
    gridEmptyDescription: 'Your shared iPhone setups will appear here.',
    filteredEmptyTitle: 'No matching setups',
    filteredEmptyDescription: 'Try another app, widget, or theme.',
    loadingLabel: 'Loading...',
  },
} satisfies Record<Locale, Record<string, string>>

export default async function MyPage({ searchParams }: Props) {
  return <MyPageContent searchParams={searchParams} locale="ja" />
}

export async function MyPageContent({ searchParams, locale }: Props & { locale: Locale }) {
  const { tab } = await searchParams
  const activeTab = tab === 'liked' ? 'liked' : 'mine'
  const t = copy[locale]

  const user = await getAuthenticatedUser()
  if (!user) redirect(t.loginPath)

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
    <div className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          <UserRound size={13} />
          {t.eyebrow}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">{t.title}</h1>
          <p className="max-w-xl text-sm text-muted leading-relaxed">
            {t.description}
          </p>
        </div>
      </div>

      <div className="gallery-caption rounded-full p-1 inline-flex">
        <Link
          href={t.pageHref}
          className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
            activeTab === 'mine'
              ? 'bg-accent text-white shadow-md'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Grid2X2 size={14} />
          {t.mineTab}
        </Link>
        <Link
          href={t.likedHref}
          className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
            activeTab === 'liked'
              ? 'bg-accent text-white shadow-md'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Heart size={14} />
          {t.likedTab}
        </Link>
      </div>

      {posts.length > 0 ? (
        <PostGrid
          initialPosts={posts as never}
          showEdit={activeTab === 'mine'}
          emptyTitle={t.gridEmptyTitle}
          emptyDescription={t.gridEmptyDescription}
          filteredEmptyTitle={t.filteredEmptyTitle}
          filteredEmptyDescription={t.filteredEmptyDescription}
          loadingLabel={t.loadingLabel}
          locale={locale}
        />
      ) : (
        <div className="gallery-shelf rounded-[2.25rem] px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-accent/10 text-accent">
            {activeTab === 'mine' ? <ImagePlus size={28} /> : <Heart size={28} />}
          </div>
          <h2 className="mt-5 text-xl font-black">
            {activeTab === 'mine' ? t.emptyMineTitle : t.emptyLikedTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {activeTab === 'mine'
              ? t.emptyMineDescription
              : t.emptyLikedDescription}
          </p>
          {activeTab === 'mine' && (
            <Link href={t.uploadHref} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-accent shadow-lg shadow-emerald-950/10 hover:bg-accent-strong hover:scale-[1.01] active:scale-95 transition-all">
              <ImagePlus size={16} />
              {t.uploadLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
