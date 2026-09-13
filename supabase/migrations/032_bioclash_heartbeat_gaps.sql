ALTER TABLE bioclash_attempts
  ADD COLUMN IF NOT EXISTS heartbeat_gaps int NOT NULL DEFAULT 0;
