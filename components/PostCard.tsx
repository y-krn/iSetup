import Image from 'next/image'
import Link from 'next/link'
import { LikeButton } from './LikeButton'
import { TagBadge } from './TagBadge'
import { DeleteButton } from './DeleteButton'

type AppInfo = { url: string; icon: string; trackName: string }

type ExtractedTags = {
  apps?: string[]
  widgets?: string[]
  theme?: string
  dock_apps?: string[]
  wallpaper_colors?: string[]
  app_links?: Record<string, AppInfo>
}

type Post = {
  id: string
  image_url: string
  like_count: number
  extracted_tags: ExtractedTags
  created_at: string
  anon_user_id: string | null
}

type Props = { post: Post; priority?: boolean }

export function PostCard({ post, priority }: Props) {
  const tags = post.extracted_tags ?? {}
  const apps = tags.apps?.slice(0, 3) ?? []
  const appLinks = tags.app_links ?? {}
  const theme = tags.theme

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <Link href={`/posts/${post.id}`} className="block relative aspect-[9/19.5]">
        <Image
          src={post.image_url}
          alt="iOS home screen"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
        />
        {theme && (
          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {theme}
          </span>
        )}
      </Link>
      <div className="p-2 space-y-2">
        <div className="flex flex-wrap gap-1">
          {apps.map(app => <TagBadge key={app} tag={app} type="app" label={appLinks[app]?.trackName} />)}
        </div>
        <div className="flex items-center justify-between">
          <LikeButton postId={post.id} initialCount={post.like_count} />
          <DeleteButton postId={post.id} ownerAnonId={post.anon_user_id} />
        </div>
      </div>
    </div>
  )
}
