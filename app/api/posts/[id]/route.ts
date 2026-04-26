import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { lookupApps } from '@/lib/app-store'

const BUCKET = 'screenshots'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { anonUserId, apps, dock_apps, widgets, theme, app_links, widget_links } = await req.json()
    if (!anonUserId) return NextResponse.json({ error: 'anonUserId required' }, { status: 400 })

    const supabase = createAdminClient()

    // 認可確認
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('anon_user_id, extracted_tags')
      .eq('id', id)
      .single()

    if (fetchError || !post) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (post.anon_user_id !== anonUserId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const currentTags = (post.extracted_tags ?? {}) as Record<string, unknown>
    const currentAppLinks = (currentTags.app_links ?? {}) as Record<string, unknown>
    const currentWidgetLinks = (currentTags.widget_links ?? {}) as Record<string, unknown>

    // クライアント送信のlinksを優先 (候補選択UIで上書き済み)
    const clientAppLinks = (app_links ?? {}) as Record<string, unknown>
    const clientWidgetLinks = (widget_links ?? {}) as Record<string, unknown>
    const baseAppLinks = { ...currentAppLinks, ...clientAppLinks }
    const baseWidgetLinks = { ...currentWidgetLinks, ...clientWidgetLinks }

    const cleanArr = (a: unknown) => (Array.isArray(a) ? a.map(String).map(s => s.trim()).filter(Boolean) : undefined)
    const newApps = cleanArr(apps)
    const newDockApps = cleanArr(dock_apps)
    const newWidgets = cleanArr(widgets)

    // 未解決アプリのみ iTunes API ルックアップ
    const allApps = [...(newApps ?? []), ...(newDockApps ?? [])]
    const unknownApps = allApps.filter(n => !(n in baseAppLinks))
    const fetchedAppLinks = unknownApps.length > 0 ? await lookupApps(unknownApps) : {}
    const mergedAppLinks: Record<string, unknown> = {}
    for (const name of new Set(allApps)) {
      const v = baseAppLinks[name] ?? fetchedAppLinks[name]
      if (v !== undefined) mergedAppLinks[name] = v
    }

    const unknownWidgets = (newWidgets ?? []).filter(n => !(n in baseWidgetLinks))
    const fetchedWidgetLinks = unknownWidgets.length > 0 ? await lookupApps(unknownWidgets) : {}
    const mergedWidgetLinks: Record<string, unknown> = {}
    for (const name of new Set(newWidgets ?? [])) {
      const v = baseWidgetLinks[name] ?? fetchedWidgetLinks[name]
      if (v !== undefined) mergedWidgetLinks[name] = v
    }

    const updated = {
      ...currentTags,
      ...(newApps !== undefined ? { apps: newApps } : {}),
      ...(newDockApps !== undefined ? { dock_apps: newDockApps } : {}),
      ...(newWidgets !== undefined ? { widgets: newWidgets } : {}),
      ...(theme !== undefined ? { theme } : {}),
      app_links: mergedAppLinks,
      widget_links: mergedWidgetLinks,
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update({ extracted_tags: updated })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ ok: true, extracted_tags: updated })
  } catch (e) {
    console.error('patch error:', e)
    return NextResponse.json({ error: 'update failed' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { anonUserId } = await req.json()
    if (!anonUserId) return NextResponse.json({ error: 'anonUserId required' }, { status: 400 })

    const supabase = createAdminClient()

    // 投稿取得 + 認可確認
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('id, image_path, anon_user_id')
      .eq('id', id)
      .single()

    if (fetchError || !post) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (post.anon_user_id !== anonUserId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    // Storage画像削除
    await supabase.storage.from(BUCKET).remove([post.image_path])

    // DB削除 (likes は cascade)
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id)
    if (deleteError) throw deleteError

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('delete error:', e)
    return NextResponse.json({ error: 'delete failed' }, { status: 500 })
  }
}
