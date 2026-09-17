ALTER TABLE public.bioclash_attempts
  ADD COLUMN IF NOT EXISTS extension_penalty numeric NOT NULL DEFAULT 0;
