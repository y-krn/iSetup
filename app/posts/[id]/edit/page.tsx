import { notFound, redirect } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { BackButton } from '@/components/BackButton'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAuthenticatedUser } from '@/lib/auth-server'
import { EditTagsForm } from '@/components/EditTagsForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/posts/${id}/edit`)
  const supabase = createAdminClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  const tags = post.extracted_tags ?? {}

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-3">
        <BackButton fallback={`/posts/${id}`} variant="text" />
        <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          <SlidersHorizontal size={13} />
          Setup Editor
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">タグを編集</h1>
          <p className="max-w-xl text-sm text-muted leading-relaxed">
            AIが読み取ったアプリ、Dock、ウィジェット、テーマを手直しできます。
          </p>
        </div>
      </div>

      <EditTagsForm
        postId={id}
        ownerAnonId={post.anon_user_id}
        initialApps={tags.apps ?? []}
        initialDockApps={tags.dock_apps ?? []}
        initialWidgets={tags.widgets ?? []}
        initialTheme={tags.theme ?? ''}
        appLinks={tags.app_links ?? {}}
        widgetLinks={tags.widget_links ?? {}}
      />
    </div>
  )
}
