alter table public.bioclash_attempts
  add column if not exists extension_blocks_used int not null default 0,
  add column if not exists tab_close_events int not null default 0;
