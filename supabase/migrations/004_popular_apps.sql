create or replace function popular_apps(limit_count int default 12)
returns table(name text, use_count bigint, info jsonb)
language sql stable security definer as $$
  with app_uses as (
    select
      jsonb_array_elements_text(coalesce(extracted_tags->'apps', '[]'::jsonb)) as n,
      extracted_tags->'app_links' as links
    from posts
    union all
    select
      jsonb_array_elements_text(coalesce(extracted_tags->'dock_apps', '[]'::jsonb)) as n,
      extracted_tags->'app_links' as links
    from posts
  )
  select
    n,
    count(*),
    (array_agg(links->n) filter (where links->n is not null))[1]
  from app_uses
  where n <> ''
  group by n
  order by count(*) desc, n
  limit limit_count;
$$;

grant execute on function popular_apps(int) to anon, authenticated;
