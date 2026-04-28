import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
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
    <div className="max-w-sm mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BackButton fallback={`/posts/${id}`} />
        <h1 className="text-2xl font-bold tracking-tight">タグを編集</h1>
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
