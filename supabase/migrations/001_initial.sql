-- posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_path text not null,
  anon_user_id uuid,
  extracted_tags jsonb default '{}',
  like_count int default 0,
  created_at timestamptz default now()
);

-- likes table
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  anon_user_id uuid not null,
  created_at timestamptz default now(),
  unique(post_id, anon_user_id)
);

-- RLS
alter table posts enable row level security;
alter table likes enable row level security;

create policy "posts_select" on posts for select using (true);
create policy "posts_insert" on posts for insert with check (true);

create policy "likes_select" on likes for select using (true);
create policy "likes_insert" on likes for insert with check (true);
create policy "likes_delete" on likes for delete using (true);

-- like_count sync function
create or replace function sync_like_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update posts set like_count = like_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update posts set like_count = like_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$;

create trigger on_like_change
after insert or delete on likes
for each row execute function sync_like_count();
