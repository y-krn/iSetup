-- trackId に該当する app_links/widget_links を持つ posts を返す関数
-- URLパターン: https://apps.apple.com/.../idXXXXX または .../idXXXXX?...
create or replace function posts_by_track_id(track_id text)
returns setof posts language sql stable security definer as $$
  select distinct on (id, created_at) p.*
  from posts p
  where
    exists (
      select 1 from jsonb_each(coalesce(p.extracted_tags->'app_links', '{}'::jsonb)) e(k, v)
      where v->>'url' ~ ('/id' || track_id || '(\?|$|/)')
    )
    or exists (
      select 1 from jsonb_each(coalesce(p.extracted_tags->'widget_links', '{}'::jsonb)) e(k, v)
      where v->>'url' ~ ('/id' || track_id || '(\?|$|/)')
    )
  order by created_at desc, id;
$$;

grant execute on function posts_by_track_id(text) to anon, authenticated;
