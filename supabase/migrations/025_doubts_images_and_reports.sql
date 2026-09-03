
alter table public.doubts
  add column if not exists is_removed boolean not null default false;

create table if not exists public.doubt_images (
  id         uuid primary key default gen_random_uuid(),
  doubt_id   uuid not null references public.doubts(id) on delete cascade,
  image_path text not null check (char_length(image_path) between 1 and 512),
  position   int not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.doubt_reply_images (
  id         uuid primary key default gen_random_uuid(),
  reply_id   uuid not null references public.doubt_replies(id) on delete cascade,
  image_path text not null check (char_length(image_path) between 1 and 512),
  position   int not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_doubt_images_doubt on public.doubt_images (doubt_id, position);
create index if not exists idx_doubt_reply_images_reply on public.doubt_reply_images (reply_id, position);

alter table public.doubt_images enable row level security;
alter table public.doubt_reply_images enable row level security;

drop policy if exists doubt_images_select_all on public.doubt_images;
create policy doubt_images_select_all on public.doubt_images
  for select using (true);

drop policy if exists doubt_images_insert_own on public.doubt_images;
create policy doubt_images_insert_own on public.doubt_images
  for insert
  with check (
    exists (select 1 from public.doubts d where d.id = doubt_id and d.user_id = auth.uid())
  );

grant select on public.doubt_images to anon, authenticated;
grant insert (doubt_id, image_path, position) on public.doubt_images to authenticated;

drop policy if exists doubt_reply_images_select_all on public.doubt_reply_images;
create policy doubt_reply_images_select_all on public.doubt_reply_images
  for select using (true);

drop policy if exists doubt_reply_images_insert_own on public.doubt_reply_images;
create policy doubt_reply_images_insert_own on public.doubt_reply_images
  for insert
  with check (
    exists (select 1 from public.doubt_replies r where r.id = reply_id and r.user_id = auth.uid())
  );

grant select on public.doubt_reply_images to anon, authenticated;
grant insert (reply_id, image_path, position) on public.doubt_reply_images to authenticated;

create table if not exists public.doubt_reports (
  id          uuid primary key default gen_random_uuid(),
  doubt_id    uuid not null references public.doubts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  reason      text not null check (char_length(reason) between 1 and 1000),
  status      text not null default 'open'
                 check (status in ('open', 'actioned', 'dismissed')),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (doubt_id, reporter_id)
);

create index if not exists idx_doubt_reports_doubt on public.doubt_reports (doubt_id);

alter table public.doubt_reports enable row level security;

drop policy if exists doubt_reports_select_own on public.doubt_reports;
create policy doubt_reports_select_own on public.doubt_reports
  for select using (auth.uid() = reporter_id);

drop policy if exists doubt_reports_insert_own on public.doubt_reports;
create policy doubt_reports_insert_own on public.doubt_reports
  for insert
  with check (auth.uid() = reporter_id);

grant select on public.doubt_reports to authenticated;
grant insert (doubt_id, reason) on public.doubt_reports to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('doubt-images', 'doubt-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists doubt_images_storage_insert_own on storage.objects;
create policy doubt_images_storage_insert_own on storage.objects
  for insert
  with check (
    bucket_id = 'doubt-images'
    and exists (
      select 1 from public.doubts d
      where d.id::text = (storage.foldername(name))[1] and d.user_id = auth.uid()
    )
  );

drop policy if exists doubt_images_storage_select_public on storage.objects;
create policy doubt_images_storage_select_public on storage.objects
  for select
  using (
    bucket_id = 'doubt-images'
    and exists (
      select 1 from public.doubts d
      where d.id::text = (storage.foldername(name))[1] and d.is_removed = false
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('doubt-reply-images', 'doubt-reply-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists doubt_reply_images_storage_insert_own on storage.objects;
create policy doubt_reply_images_storage_insert_own on storage.objects
  for insert
  with check (
    bucket_id = 'doubt-reply-images'
    and exists (
      select 1 from public.doubt_replies r
      where r.id::text = (storage.foldername(name))[1] and r.user_id = auth.uid()
    )
  );

drop policy if exists doubt_reply_images_storage_select_public on storage.objects;
create policy doubt_reply_images_storage_select_public on storage.objects
  for select
  using (
    bucket_id = 'doubt-reply-images'
    and exists (
      select 1 from public.doubt_replies r
      join public.doubts d on d.id = r.thread_id
      where r.id::text = (storage.foldername(name))[1] and d.is_removed = false
    )
  );

create or replace view public.doubts_feed as
select
  d.id,
  d.title,
  d.body,
  d.subject,
  d.is_closed,
  d.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country,
  (select count(*) from public.doubt_replies r where r.thread_id = d.id) as comment_count,
  coalesce(imgs.images, '[]'::jsonb) as images
from public.doubts d
join public.profiles p on p.id = d.user_id
left join lateral (
  select jsonb_agg(
           jsonb_build_object('image_path', di.image_path, 'position', di.position)
           order by di.position
         ) as images
  from public.doubt_images di
  where di.doubt_id = d.id
) imgs on true
where p.is_hidden = false and d.is_removed = false
order by d.created_at desc;

create or replace view public.doubt_replies_feed as
select
  r.id,
  r.thread_id,
  r.body,
  r.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country,
  p.is_staff,
  coalesce(imgs.images, '[]'::jsonb) as images
from public.doubt_replies r
join public.profiles p on p.id = r.user_id
join public.doubts d on d.id = r.thread_id
left join lateral (
  select jsonb_agg(
           jsonb_build_object('image_path', ri.image_path, 'position', ri.position)
           order by ri.position
         ) as images
  from public.doubt_reply_images ri
  where ri.reply_id = r.id
) imgs on true
where p.is_hidden = false and d.is_removed = false
order by r.created_at asc;

grant select on public.doubts_feed to anon, authenticated;
grant select on public.doubt_replies_feed to anon, authenticated;
