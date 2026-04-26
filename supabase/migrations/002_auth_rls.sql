-- 既存ポリシー削除
drop policy if exists "posts_select" on posts;
drop policy if exists "posts_insert" on posts;
drop policy if exists "likes_select" on likes;
drop policy if exists "likes_insert" on likes;
drop policy if exists "likes_delete" on likes;

-- posts: 全員 read、認証ユーザのみ自分の投稿に対して操作可
create policy "posts_select" on posts for select using (true);
create policy "posts_insert" on posts for insert
  with check (auth.uid() = anon_user_id);
create policy "posts_update" on posts for update
  using (auth.uid() = anon_user_id)
  with check (auth.uid() = anon_user_id);
create policy "posts_delete" on posts for delete
  using (auth.uid() = anon_user_id);

-- likes: 全員 read、認証ユーザのみ自分のlikeを操作可
create policy "likes_select" on likes for select using (true);
create policy "likes_insert" on likes for insert
  with check (auth.uid() = anon_user_id);
create policy "likes_delete" on likes for delete
  using (auth.uid() = anon_user_id);

-- 既存データクリア (移行時)
truncate table likes, posts cascade;
