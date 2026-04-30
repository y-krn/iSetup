import { unstable_cache } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export type AppInfo = { url: string; icon: string; trackName: string }
export type PopularApp = { name: string; use_count: number; info: AppInfo | null }

export const getPopularApps = unstable_cache(
  async (limit: number): Promise<PopularApp[]> => {
    const supabase = createAdminClient()
    const { data } = await supabase.rpc('popular_apps', { limit_count: limit })
    return (data as PopularApp[]) ?? []
  },
  ['popular_apps'],
  { revalidate: 60, tags: ['popular_apps'] },
)
