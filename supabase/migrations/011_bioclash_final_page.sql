alter table public.bioclash_attempts
  add column if not exists reached_final_page boolean not null default false;
