
alter table public.biolab_submissions alter column image_path drop not null;

alter table public.biolab_submissions drop constraint if exists biolab_submissions_image_path_check;
alter table public.biolab_submissions
  add constraint biolab_submissions_image_path_check
  check (image_path is null or char_length(image_path) between 1 and 512);
