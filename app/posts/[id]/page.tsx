import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CalendarDays, LayoutGrid, Palette, PanelBottom, Smartphone, WandSparkles } from 'lucide-react'
import { BackButton } from '@/components/BackButton'
import { createAdminClient } from '@/lib/supabase/admin'
import { LikeButton } from '@/components/LikeButton'
import { TagBadge } from '@/components/TagBadge'
import { AppLink } from '@/components/AppLink'

type Props = { params: Promise<{ id: string }> }

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  const tags = post.extracted_tags ?? {}
  const apps: string[] = tags.apps ?? []
  const widgets: string[] = tags.widgets ?? []
  const dockApps: string[] = tags.dock_apps ?? []
  const colors: string[] = tags.wallpaper_colors ?? []
  const theme: string = tags.theme ?? ''
  const appLinks: Record<string, { url: string; icon: string; trackName: string }> = tags.app_links ?? {}
  const widgetLinks: Record<string, { url: string; icon: string; trackName: string }> = tags.widget_links ?? {}
  const createdAt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.created_at))
  const appCount = apps.length + dockApps.length

  return (
    <div className="space-y-6">
      <BackButton fallback="/" variant="text" />

      <div className="grid gap-6 md:grid-cols-[minmax(270px,0.78fr)_minmax(0,1fr)] md:items-start">
        <section className="gallery-shelf rounded-[2.25rem] p-4 sm:p-5 md:sticky md:top-20">
          <div className="relative mx-auto max-w-[18rem] lg:max-w-sm">
            <div className="phone-frame relative aspect-[9/19.5] overflow-hidden rounded-[2.85rem] p-[9px]">
              <div className="relative h-full overflow-hidden rounded-[2.32rem] bg-black">
                <Image
                  src={post.image_url}
                  alt="iOS home screen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 390px"
                  className="object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18),transparent_28%,transparent_74%,rgba(255,255,255,0.08))]" />
                <div className="absolute top-2 left-1/2 z-10 h-[3.2%] min-h-[18px] w-[28%] -translate-x-1/2 rounded-full bg-black shadow-[0_1px_3px_rgba(255,255,255,0.14)] pointer-events-none" />
                {theme && (
                  <span className="gallery-caption absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-foreground shadow-lg">
                    {theme}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute left-[-3px] top-[18%] h-12 w-1 rounded-l-full bg-black/70" />
            <div className="absolute right-[-3px] top-[26%] h-16 w-1 rounded-r-full bg-black/70" />
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
              <Smartphone size={13} />
              Setup Profile
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'iOS'} home setup
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {createdAt}
                </span>
                <LikeButton postId={post.id} initialCount={post.like_count} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="gallery-caption rounded-2xl p-3">
              <div className="text-2xl font-black">{appCount}</div>
              <div className="text-[11px] font-semibold text-muted">Apps</div>
            </div>
            <div className="gallery-caption rounded-2xl p-3">
              <div className="text-2xl font-black">{widgets.length}</div>
              <div className="text-[11px] font-semibold text-muted">Widgets</div>
            </div>
            <div className="gallery-caption rounded-2xl p-3">
              <div className="text-2xl font-black">{colors.length}</div>
              <div className="text-[11px] font-semibold text-muted">Colors</div>
            </div>
          </div>

          {colors.length > 0 && (
            <div className="gallery-caption rounded-3xl p-4 space-y-3">
              <h2 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.16em]">
                <Palette size={14} />
                Wallpaper Palette
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {colors.map(c => (
                  <div key={c} className="space-y-2">
                    <div className="h-16 rounded-2xl border border-black/10 shadow-inner" style={{ backgroundColor: c }} />
                    <div className="text-[10px] font-semibold text-muted">{c}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {apps.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.16em]">
                <LayoutGrid size={14} />
                Home Screen Apps
              </h2>
              <div className="flex flex-wrap gap-2">
                {apps.map(app => <AppLink key={app} name={app} info={appLinks[app]} />)}
              </div>
            </div>
          )}

          {dockApps.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.16em]">
                <PanelBottom size={14} />
                Dock
              </h2>
              <div className="gallery-caption rounded-3xl p-3">
                <div className="flex flex-wrap gap-2">
                  {dockApps.map(app => <AppLink key={app} name={app} info={appLinks[app]} />)}
                </div>
              </div>
            </div>
          )}

          {widgets.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.16em]">
                <WandSparkles size={14} />
                Widgets
              </h2>
              <div className="flex flex-wrap gap-2">
                {widgets.map(w => <TagBadge key={w} tag={w} type="widget" label={widgetLinks[w]?.trackName} />)}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
