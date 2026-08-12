alter table public.bioclash_attempts
  add column if not exists active_session_token       text,
  add column if not exists active_session_claimed_at   timestamptz;

alter table public.bioclash_attempt_blocks
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
