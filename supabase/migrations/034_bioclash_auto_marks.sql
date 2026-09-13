ALTER TABLE bioclash_attempts
  ADD COLUMN IF NOT EXISTS auto_marks_earned numeric,
  ADD COLUMN IF NOT EXISTS auto_marks_total  numeric;
